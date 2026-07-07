const admin=require('../models/admin');
const student=require('../models/student');
const professor=require('../models/professor');


async function registerAdmin(req,res){
    const {fullname,email,password}=req.body;
    if(req.body.admincode==='adminsggs'){
await admin.create({
    fullname,
    email,
    password
});
    }
return res.redirect('/admin-login');
}

async function loginAdmin(req,res){
    const {email,password}=req.body;
    const foundadmin=await admin.findOne({email,password});
    if(!foundadmin){
        return res.redirect('/admin-login');
    }
    else{
        return res.redirect(
    '/admin-dashboard'
);
    }
}

async function getstudents(req,res){
    const students= await student.find();
    res.json(students);
} 

async function searchStudent(req, res) {

    const email = req.query.email;

    const foundstudent = await student.findOne({
        email: email
    });

    if (!foundstudent) {
        return res.json(null);
    }

    res.json(foundstudent);
}
async function viewStudent(req,res){
    const id=req.params.id;
    const searchstudent=await student.findById(id);
    res.json(searchstudent);
}

async function deleteStudent(req,res){
    const id=req.params.id;
    await student.findByIdAndDelete(id);
    res.json({message:"Student deleted successfully"});
}
async function getProfessors(req, res) {
    const professors = await professor.find();
    res.json(professors);
}

async function searchProfessor(req, res) {

    const email = req.query.email;

    const foundProfessor = await professor.findOne({
        email: email
    });

    if (!foundProfessor) {
        return res.json(null);
    }

    res.json(foundProfessor);
}

async function viewProfessor(req, res) {

    const id = req.params.id;

    const foundProfessor = await professor.findById(id);

    res.json(foundProfessor);
}

async function deleteProfessor(req, res) {

    const id = req.params.id;

    await professor.findByIdAndDelete(id);

    res.json({
        message: "Professor deleted successfully"
    });
}

async function getAdmins(req, res) {
    const admins = await admin.find();
    res.json(admins);
}

// Search admin by email
async function searchAdmin(req, res) {

    const email = req.query.email;

    const foundAdmin = await admin.findOne({
        email: email
    });

    res.json(foundAdmin);
}

// View one admin
async function viewAdmin(req, res) {

    const id = req.params.id;

    const foundAdmin = await admin.findById(id);

    res.json(foundAdmin);
}

// Delete admin
async function deleteAdmin(req, res) {

    const id = req.params.id;

    await admin.findByIdAndDelete(id);

    res.json({
        message: "Admin deleted successfully"
    });

}

module.exports={
    registerAdmin,
    loginAdmin,
    getstudents,
    searchStudent,
    viewStudent,
    deleteStudent,
    searchProfessor,
    viewProfessor,
    deleteProfessor,
    getProfessors,
    getAdmins,
    searchAdmin,
    viewAdmin,
    deleteAdmin
}
