//all the requirements
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const {registerStudent,loginStudent} = require('./controllers/student');
const {registerProfessor,loginProfessor,generateQR,dispatchReport} = require('./controllers/professor');
const {markAttendance}=require('./controllers/attendance');
const {registerAdmin,loginAdmin,getstudents,searchStudent,viewStudent,deleteStudent,
    getProfessors,searchProfessor,viewProfessor,deleteProfessor,
    getAdmins,searchAdmin,viewAdmin,deleteAdmin
} = require('./controllers/admin');


//defines
const app = express();

app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(express.static(__dirname));

// database connection
 mongoose.connect(
     "mongodb+srv://Attendease:abhi7745shek@attendease.1zx6wpo.mongodb.net/attendease?retryWrites=true&w=majority"
 )
 .then(()=>{

     console.log("MongoDB Connected");

 })
 .catch((err)=>{
    console.log(err);

});

//routes
app.get("/", (req, res) => {

    res.sendFile(__dirname + '/dashboards/index.html');

});

app.get("/student-login", (req, res) => {
    res.sendFile(__dirname + '/dashboards/student-login.html');
});

app.get("/student-signup", (req, res) => {

    res.sendFile( __dirname + '/dashboards/student-signup.html');

});


app.post("/student-signup", registerStudent);

app.post("/student-login", loginStudent);

app.get("/student-dashboard", (req, res) => {

    res.sendFile(__dirname + '/dashboards/student.html');
});

app.get("/professor-login", (req, res) => {
    res.sendFile(__dirname + '/dashboards/professor-login.html');
});   
app.get("/professor-signup", (req, res) => {
    res.sendFile( __dirname + '/dashboards/professor-signup.html');
});

app.post("/professor-signup", registerProfessor);

app.post("/professor-login", loginProfessor);

app.get("/professor-dashboard", (req, res) => {

    res.sendFile(__dirname + '/dashboards/professor.html');
});

app.post('/generate-qr',generateQR);

app.post(
    '/mark-attendance',
    markAttendance
);

app.get(
    '/dispatch-report',
    dispatchReport
);

app.get("/admin-login", (req, res) => {
  res.sendFile(__dirname + '/dashboards/admin-login.html');
});

app.get("/admin-signup", (req, res) => {
    res.sendFile(__dirname + '/dashboards/admin-signup.html');
});
app.post("/admin-signup", registerAdmin);

app.post("/admin-login", loginAdmin);

app.get("/admin-dashboard", (req, res) => {
    res.sendFile(__dirname + '/dashboards/admin.html');
});
app.get("/admin/manage-student",(req,res)=>
{
    res.sendFile(__dirname + '/dashboards/manage-student.html');
});
app.get("/admin/get-students",getstudents);

app.get("/admin/search-student",searchStudent);

app.get("/admin/view-student/:id",viewStudent);

app.delete("/admin/delete-student/:id",deleteStudent);

app.get("/admin/manage-professor", (req, res) => {
    res.sendFile(__dirname + "/dashboards/manage-professor.html");
});

app.get("/admin/get-professors", getProfessors);

app.get("/admin/search-professor", searchProfessor);

app.get("/admin/view-professor/:id", viewProfessor);

app.delete("/admin/delete-professor/:id", deleteProfessor);

app.get("/admin/manage-admin", (req, res) => {

    res.sendFile(__dirname + "/dashboards/manage-admin.html");

});

app.get("/admin/get-admins", getAdmins);

app.get("/admin/search-admin", searchAdmin);

app.get("/admin/view-admin/:id", viewAdmin);

app.delete("/admin/delete-admin/:id", deleteAdmin);

//server
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

server.listen(PORT, "0.0.0.0", () => {

    console.log("Server is running on port " + PORT);

});
