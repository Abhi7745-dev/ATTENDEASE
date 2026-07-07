const student = require('../models/student');



async function registerStudent(req,res){
    const {fullname,email,registrationnumber,branch,password} = req.body;
    await student.create({
        fullname,
        email,
        registrationnumber,
        branch,
        password
    });
    return res.redirect('/student-login');

}


async function loginStudent(req,res){
    const {email,password} = req.body;
    const foundStudent = await student.findOne({email,password});
    if(!foundStudent){
        return res.redirect('/student-login');
    }
    else{

    return res.redirect(

        `/student-dashboard?id=${foundStudent._id}`

    );

}
}
module.exports = {
    registerStudent,
    loginStudent
}
