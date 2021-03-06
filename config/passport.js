const LocalStrategy=require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Local user model
const User=mongoose.model('Users');
module.exports=function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done)=>{

        User.findOne({
            email:email
        }).then(user=>{
            //Match user
            if(!user){
                return done(null,false,{message:'No User Found'});
                
            }
            //Match password 

            bcrypt.compare(password,user.password , (err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    
                    return done(null,user);
                }else{
                    return done(null,false,{message:'Password Incorrect'});
                }

            })
        })
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}