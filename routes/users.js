const express= require('express');
const router=express.Router();
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcryptjs');
const passport = require('passport');


// require('../models/Idea');
// const Idea =mongoose.model('Ideas');
//Load Idea Model
require('../models/User');
const User =mongoose.model('Users');


//User Login Route
router.get('/login',(req,res)=>{
    res.render('users/login');

});
router.get('/register',(req,res)=>{
    res.render('users/register');

});
//Login from POST
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect:'/ideas',
    failureRedirect:'/users/login',
    failureFlash:true,

})(req,res,next);
});
//Register From POST
router.post('/register',(req,res)=>{
    let errors=[];
    if (validator.equals(req.body.password,req.body.cpassword)) {
        
        if (validator.isStrongPassword(req.body.password)) {
            User.findOne({email:req.body.email})
               .then(user=>{
                   if (user) {
                       req.flash('error_msg','Email already registered');
                        res.redirect('/users/register');

                    }else{


                        const newUser=({
                            name:req.body.name,
                            email:req.body.email,
                            password:req.body.password
                        })
                        bcrypt.genSalt(10, function(err, salt) {
                         bcrypt.hash(newUser.password, salt, (err, hash) =>{
                             if(err) throw err;
                             newUser.password=hash;
                             new User(newUser)
                              .save()
                              .then(user=>{
                                  req.flash('success_msg','You are now regsitred and can log in ');
                                  res.redirect('/users/login')
                              })
                              .catch(err=>{
                                  console.log(err);
                                  return;
                              })
                 
                         });
                     });
                 
                        console.log(newUser);
                        
                    }
               }

               )
       
        }else{
           
            errors.push({text:'password is not strong'});
        }  
    }else{
        errors.push({text:'passwords do not match'});
        
    }
    if (errors.length>0) {
        res.render('users/register',{
            errors:errors
        })}
    
})
//Logout User
router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','You are logged out');
res.redirect('/users/login')
});
module.exports=router;

