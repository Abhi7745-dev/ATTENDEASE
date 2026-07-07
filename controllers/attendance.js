const Attendance =
require('../models/attendance');

const Student =
require('../models/student');

const { getDistance } =
require("geolib");

async function markAttendance(
    req,
    res
){

    try{

        const {

            studentId,
            sessionId,
            className,
            roomName,
            studentLatitude,
            studentLongitude,
            teacherLatitude,
            teacherLongitude

        } = req.body;

        const foundStudent =
        await Student.findById(
            studentId
        );

        if(!foundStudent){

            return res.json({

                message:
                'Student Not Found'

            });

        }

        // Prevent duplicate attendance
        const alreadyMarked =
        await Attendance.findOne({

            sessionId:
            sessionId,

            studentEmail:
            foundStudent.email

        });

        if(alreadyMarked){

            return res.json({

                message:
                'Attendance Already Marked'

            });

        }

        // Calculate distance
        const distance = getDistance(

            {
                latitude: Number(studentLatitude),
                longitude: Number(studentLongitude)
            },

            {
                latitude: Number(teacherLatitude),
                longitude: Number(teacherLongitude)
            }

        );

        console.log("Distance =", distance, "meters");

        // Check if student is outside allowed range
        if(distance > 30){

            return res.json({

                message:
                "You are outside the classroom"

            });

        }

        // Save attendance
        await Attendance.create({

            sessionId:
            sessionId,

            studentName:
            foundStudent.fullname,

            studentEmail:
            foundStudent.email,

            registrationNumber:
            foundStudent.registrationnumber,

            branch:
            foundStudent.branch,

            className:
            className,

            roomName:
            roomName,

            studentLatitude:
            studentLatitude,

            studentLongitude:
            studentLongitude,

            teacherLatitude:
            teacherLatitude,

            teacherLongitude:
            teacherLongitude

        });

        res.json({

            message:
            "Attendance Marked"

        });

    }

    catch(err){

        console.log(err);

        res.json({

            message:
            "Error"

        });

    }

}

module.exports = {
    markAttendance
};