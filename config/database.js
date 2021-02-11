if(process.env.NODE_ENV==='production'){
module.exports={mongoURI:'mongodb+srv://souheib:souheib@vidjot-prod.5hfos.mongodb.net/vidjot-prod?retryWrites=true&w=majority'};
}else{
module.exports={mongoURI:'mongodb://localhost/vidjot-dev'};
}