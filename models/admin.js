const moongose=require('mongoose');
const { type } = require('os');

const adminSchema=new moongose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,    
        required:true
    },
    password:{
        type:String,
        required:true
    },
})

    const admin=moongose.model('admin',adminSchema);
    module.exports=admin;