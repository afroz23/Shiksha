/*
attendance = {
    roomId : [{},{},{},{}],
    roomId : [{},{},{},{}]
}

Attendance.findOneAndUpdate({subjectId : roomId , date : Date },{$set : {members : attendance[roomId]}},{unsert : true});


Attendance  : {
    subjectId,
    date,
    members  : [{
        name ,
        join,
        leave
    }]
}

Attendace : {
    subjectId,
    date
}
*/