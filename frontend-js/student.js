const params =
new URLSearchParams(
    window.location.search
);

const studentId =
params.get("id");

let scanner;
let attendanceMarked = false;

function startScanner(){

    scanner =
    new Html5Qrcode("reader");

    scanner.start(

        {
            facingMode:"environment"
        },

        {
            fps:15,

            qrbox:function(viewfinderWidth, viewfinderHeight){

                const minEdge =
                Math.min(
                    viewfinderWidth,
                    viewfinderHeight
                );

                let size;

                if(window.innerWidth <= 480){

                    // Mobile
                    size = minEdge * 0.85;

                }

                else if(window.innerWidth <= 768){

                    // Tablet
                    size = minEdge * 0.70;

                }

                else{

                    // Laptop/Desktop
                    size = minEdge * 0.45;

                }

                return{

                    width:size,
                    height:size

                };

            },

            aspectRatio:1.0

        },

        onScanSuccess

    )

    .catch(err=>{

        alert(
            "Camera Error : " +
            err
        );

    });

}

async function onScanSuccess(decodedText){

    if(attendanceMarked){
        return;
    }

    attendanceMarked = true;

    try{

        const qr =
        JSON.parse(decodedText);

        navigator.geolocation.getCurrentPosition(

            async function(position){

                const studentLatitude =
                position.coords.latitude;

                const studentLongitude =
                position.coords.longitude;

                const response =
                await fetch(
                    "/mark-attendance",
                    {

                        method:"POST",

                        headers:{
                            "Content-Type":
                            "application/json"
                        },

                        body:JSON.stringify({

                            studentId:
                            studentId,

                            sessionId:
                            qr.sessionId,

                            className:
                            qr.className,

                            roomName:
                            qr.roomName,

                            studentLatitude:
                            studentLatitude,

                            studentLongitude:
                            studentLongitude,

                            teacherLatitude:
                            qr.latitude,

                            teacherLongitude:
                            qr.longitude

                        })

                    }
                );

                const data =
                await response.json();

                await scanner.stop();

                await scanner.clear();

                document
                .getElementById("scanModal")
                .style.display =
                "none";

                document
                .getElementById("scanResult")
                .innerText =
                data.message;

            },

            function(error){

                attendanceMarked = false;
                console.log(error);
                
                alert(
                    "Location error:\n" + error.message
                );

            },

            {

                enableHighAccuracy:true,
                timeout:10000,
                maximumAge:0

            }

        );

    }

    catch(err){

        attendanceMarked = false;

        alert(
            "Error processing QR code"
        );

    }

}

async function stopScanner(){

    if(scanner){

        try{

            await scanner.stop();
            await scanner.clear();

        }

        catch(err){}

    }

    attendanceMarked = false;

    document
    .getElementById("scanModal")
    .style.display =
    "none";

}
