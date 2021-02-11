const express =require('express');
const path =require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash=require('connect-flash');
const session=require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// Import function exported by newly installed node modules.
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var validator = require('validator');
const passport = require('passport');

const app =express();
//Load routes for idea
const ideas=require('./routes/ideas');
//Load routes for users
const users=require('./routes/users');
//pasport Config 
require('./config/passport')(passport);
//DB Configue
const db =require('./config/database');

//map global promise -get rid of warning
mongoose.Promise=global.Promise;

//Connect to mongoose
mongoose.connect(db.mongoURI,{

    useMongoClient:true
})
.then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err));
//Load Idea Model 


// mongoose.connect('mongodb://localhost/vidjot-dev',{

//     useMongoClient:true
// })
// .then(()=>console.log('MongoDB Connected...'))
// .catch(err=>console.log(err));

//Handlebars Middleware
app.engine('handlebars', exphbs({
    
    defaultLayout:'main',
    runtimeOptions: {
        
                  allowProtoPropertiesByDefault: true,
        
                  allowProtoMethodsByDefault: true,
        
            }
}

));
app.set('view engine', 'handlebars');
//How middleware works
app.use(function(req,res,next){
// console.log(Date.now());
req.name='Souheib Adbdelhak';
next();
}) ;
//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());
//Static folder
app.use(express.static(path.join(__dirname,'public')));
//Methode override middleware
app.use(methodOverride('_method'))
//Express session midleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
  }));
  //Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());
  app.use(function(req,res,next){
      res.locals.success_msg=req.flash('success_msg');
      res.locals.error_msg=req.flash('error_msg');
      res.locals.error=req.flash('error');
      res.locals.user=req.user || null;
      next();
  })

//Index Route
app.get('/',(req,res)=>{
    const title="welcome";
    res.render('index',{
        title:title
    });
    
});

//About Route 
app.get('/about',(req,res)=>{
    res.render('about');
    
});
//Idea Index Page


//Use route
app.use('/ideas',ideas);
app.use('/users',users);
const port =process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})