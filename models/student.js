const mongoose = require('mongoose');



const studentSchema = new mongoose.Schema({
    
    fullname: {
        type: String,
        required: true, 

},
    email: {
        type: String,
        required: true,     
       // unique: true,
},
    registrationnumber: {
        type: String,
        required: true,     
       // unique: true,
},
    branch: {
        type: String,
        required: true, 
},
    password: {
        type: String,
        required: true, 
       // unique:true,
},
},
{
    timestamps: true,
}
);


const student = mongoose.model('student', studentSchema);
module.exports = student;