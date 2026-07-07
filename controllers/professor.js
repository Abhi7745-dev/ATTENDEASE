const professor = require('../models/professor');
const Session = require('../models/session');
const QRCode = require('qrcode');
const ExcelJS =
require('exceljs');
const Attendance =
require('../models/attendance');
const crypto = require("crypto");
const nodemailer = require('nodemailer');

const transporter =
nodemailer.createTransport({

    service:'gmail',

    auth:{

        user:'attendease.project123@gmail.com',

        pass:'nipvravxphoiyyfc'

    }

});
transporter.verify(function(error, success){

    if(error){

        console.log("ERROR:");
        console.log(error);

    }

    else{

        console.log("EMAIL SERVER READY");

    }

});
async function registerProfessor(req,res){
    const {fullname,email,department,password,invitecode} = req.body;
    if(invitecode === "proffsggs"){
    await professor.create({
        fullname,
        email,
        department,
        password
    });
    return res.redirect('/professor-login');
    }
    else{
        return res.send('invalid code');
    }
}


async function loginProfessor(req,res){
    const {email,password} = req.body;
    const foundProfessor = await professor.findOne({email,password});
    if(!foundProfessor){
        return res.redirect('/professor-login');
    }
    else{
        return res.redirect(
    `/professor-dashboard?email=${email}`
);
    }
}





async function generateQR(req, res) {

    try {

        const { className, roomName, latitude, longitude } = req.body;

        const sessionId = crypto.randomUUID();

        const qrData = JSON.stringify({

            sessionId,
            className,
            roomName,
            latitude,
            longitude

        });

        const qrImage =
        await QRCode.toDataURL(qrData);

        res.json({

            qrImage,
            sessionId

        });

    }

    catch(err){

        console.log(err);

        res.json({

            message:
            "Error generating QR"

        });

    }

}

async function dispatchReport(req,res){

    const workbook =
    new ExcelJS.Workbook();

    const worksheet =
    workbook.addWorksheet(
        'Attendance Report'
    );

    worksheet.columns = [

        {
            header:'Name',
            key:'studentName',
            width:25
        },

        {
            header:'Email',
            key:'studentEmail',
            width:30
        },

        {
            header:'Registration Number',
            key:'registrationNumber',
            width:25
        },

        {
            header:'Branch',
            key:'branch',
            width:15
        },

        {
            header:'Class',
            key:'className',
            width:20
        },

        {
            header:'Room',
            key:'roomName',
            width:15
        }

    ];

    const sessionId =
req.query.sessionId;

const records =
await Attendance.find({

    sessionId:
    sessionId

});

    records.forEach((student)=>{

        worksheet.addRow({

            studentName:
            student.studentName,

            studentEmail:
            student.studentEmail,

            registrationNumber:
            student.registrationNumber,

            branch:
            student.branch,

            className:
            student.className,

            roomName:
            student.roomName

        });

    });

   await workbook.xlsx.writeFile(
    'attendance-report.xlsx'
);

const professorEmail =
req.query.email;

await transporter.sendMail({

    from:
    'attendease.project123@gmail.com',

    to:
    professorEmail,

    subject:
    'Attendance Report',

    text:
    'Attendance report attached.',

    attachments:[
        {
            filename:
            'attendance-report.xlsx',

            path:
            'attendance-report.xlsx'
        }
    ]

});

res.send(
    'Attendance Report Sent Successfully'
);

}

module.exports = {
    registerProfessor,
    loginProfessor,
    generateQR,
    dispatchReport
}

