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

const fs = require("fs");

async function dispatchReport(req, res) {

    try {

        const sessionId = req.query.sessionId;
        const professorEmail = req.query.email;

        const records = await Attendance.find({
            sessionId: sessionId
        });

        if (records.length === 0) {

            return res.send(
                "No attendance found for this session."
            );

        }

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet(
            "Attendance Report"
        );

        worksheet.columns = [

            {
                header: "Name",
                key: "studentName",
                width: 25
            },

            {
                header: "Email",
                key: "studentEmail",
                width: 30
            },

            {
                header: "Registration Number",
                key: "registrationNumber",
                width: 25
            },

            {
                header: "Branch",
                key: "branch",
                width: 15
            },

            {
                header: "Class",
                key: "className",
                width: 20
            },

            {
                header: "Room",
                key: "roomName",
                width: 15
            }

        ];

        records.forEach((student) => {

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

        const fileName =
        `attendance-report-${sessionId}.xlsx`;

        await workbook.xlsx.writeFile(fileName);

        await transporter.sendMail({

            from:
            "attendease.project123@gmail.com",

            to:
            professorEmail,

            subject:
            "Attendance Report",

            text:
            "Attendance report attached.",

            attachments: [

                {

                    filename: fileName,

                    path: fileName

                }

            ]

        });

        if (fs.existsSync(fileName)) {

            fs.unlinkSync(fileName);

        }

        return res.send(
            "Attendance Report Sent Successfully"
        );

    }

    catch (err) {

        console.log(err);

        return res.status(500).send(
            "Failed to send attendance report."
        );

    }

}

module.exports = {
    registerProfessor,
    loginProfessor,
    generateQR,
    dispatchReport
}

