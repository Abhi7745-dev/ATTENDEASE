const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({

    sessionId: String,

    studentName: String,

    studentEmail: String,

    registrationNumber: String,

    branch: String,

    className: String,

    roomName: String,

    studentLatitude: Number,
    studentLongitude: Number,
    teacherLatitude: Number,
    teacherLongitude: Number

});

module.exports =
mongoose.model(
    'attendance',
    attendanceSchema
);