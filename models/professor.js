const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
   fullname:{
    type: String,
    required: true, 
   },
   email:{
    type: String,
    required: true, 
 
   },
   department:{
    type: String,
    required: true, 
   },
   password:{
    type: String,
    required: true,
        
   }

},
{
    timestamps: true,
});


const professor = mongoose.model('professor', professorSchema);
module.exports = professor;