// all the api routes
import * as apiHelper from '../api/controllers/apiHelper';
import * as subjectApi from '../api/controllers/subject';
import * as announcementApi from '../api/controllers/announcements';
import * as assignmentApi from '../api/controllers/assignment';
import * as scheduleApi from '../api/controllers/schedule';
import * as studentApi from '../api/controllers/student';
import * as facultyApi from '../api/controllers/faculty';

module.exports = (router) => {
    router.use(function(req,res,next){
        apiHelper.isAuthenticatedUser(req).then(isValid=>{
            if(isValid){
                next();
            }else{
                res.status(400);
                return res.send({error:'Auth Token Expired'});
            }
        }).catch(err=>{
            res.status(400);
            return res.send({error : err});
        })
    })
    router.get('/',(req,res)=>{
        res.status(200);
        console.log("In / route", req.user);
        return res.send({message : "Working!"} );
    });
    router.get('/checkForLoggedInUser',apiHelper.checkForLoggedInUser);
    router.post('/joinSubject',subjectApi.joinSubject);
    router.post('/createSubject',apiHelper.isAdmin , subjectApi.createSubject);
    router.post('/postAnnouncement',apiHelper.isAdmin,announcementApi.AddAnouncement);
    router.post('/postTestOrAssignment',apiHelper.isAdmin,assignmentApi.addAssignment);
    router.get('/getSubjectData/:subjectId',subjectApi.getSubjectData);
    router.post('/scheduleClass',apiHelper.isAdmin , scheduleApi.scheduleClass);
    router.get('/getSchedule',scheduleApi.getSchedule);
    router.get('/getFacultySchedule',apiHelper.isAdmin ,scheduleApi.getFacultySchedule);
    router.post('/submitAssignment',assignmentApi.submitAssignment);
    router.get('/getStudentSubjects',studentApi.getAllSubjects);
    router.get('/getFacultySubjects',apiHelper.isAdmin ,facultyApi.getAllSubjects);
    router.get('/getUpcomingAssignments',assignmentApi.getUpcomingAssignments);
    router.get('/getAssignments/:assignmentPostId',apiHelper.isAdmin,assignmentApi.getAssignments);
    router.get('/assignment/:ann_id',assignmentApi.getAssignmentData);
    router.post('/assignment/submit',apiHelper.isAdmin,assignmentApi.assignMark);
    router.get('/getStudentAssignmentData/:assignmentPostId',assignmentApi.getStudentAssignmentData);
}
