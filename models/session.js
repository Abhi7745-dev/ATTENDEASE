const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({

    className:{
        type:String,
        required:true
    },

    roomName:{
        type:String,
        required:true
    },

    code:{
        type:String,
        required:true
    }

},
{
    timestamps:true
});

module.exports =
mongoose.model('session',sessionSchema);