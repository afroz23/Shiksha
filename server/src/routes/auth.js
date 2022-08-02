// all the authorisation routes
import * as StudentApi from '../api/controllers/student';
import * as FacultyApi from '../api/controllers/faculty';



module.exports = (router) => {
    router.get('/',(req,res)=>{
        res.status(200);
        return res.json({status : 'Up and Running'});
    });
    router.post('/studentsignup',StudentApi.signup);
    router.post('/studentlogin',StudentApi.login);
    router.post('/facultylogin',FacultyApi.login);
    router.post('/facultysignup',FacultyApi.signup);

    
    router.get('/logout',(req,res)=>{
        res.status(200);
        return res.send({message : 'Logout Success'});
    });
}