const mongoose = require('mongoose');
const Schema=mongoose.Schema;

//Create Schema 
const IdeaSchema=new Schema({
title:{
   type: String,
   require: true
},
details:{
    type: String,
    require: true
 },
 user:{
   type: String,
   require: true
},
 date:{
    type: Date,
    default: Date.now
 }
});

mongoose.model('Ideas',IdeaSchema);