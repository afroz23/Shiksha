// all the subject related controllers
import Subject from '../models/subject';
import Student from '../models/student';
import Schedule from '../models/schedule';
import Assignment from '../models/assignment';
import Faculty from '../models/faculty';
import mongoose from 'mongoose';
import { getAllAssignments } from './assignment';
import { getAnnouncements } from './announcements';
import Q from 'q';
export function joinSubject(req,res){
    try{
        Subject.findOne({classCode : req.body.classCode,isValid : true}).then(oSub=>{
            if(oSub){
                Student.findOneAndUpdate({_id :req.user._id},{$push : { activeClasses : oSub._id }},{new : true}).then(oUser=>{
                    oSub.Students.push(req.user._id);
                    oSub.save((err,doc)=>{
                        if(err){
                            throw err;
                        }else{
                            return res.status(200).send(doc);
                        }
                    })
                }).catch(err=>{
                    return res.status(400).send({error : err.stack});
                })
            }else{
                throw 'Subject Doesn`t exist';
            }
        }).catch(err=>{
            return res.status(400).send({error : err});
        })
    }catch(err){
        return res.status(400).send({error : err});
    }
}
export function getSubjectDetail(subjectId){
    let deferred = Q.defer();
    try{
        Subject.findById(mongoose.Types.ObjectId(subjectId)).then(oSub=>{
            deferred.resolve(oSub);
        })
    }catch(err){
        deferred.reject(err.stack);
    }
    return deferred.promise;
}


export function createSubject(req,res){
    try{    
        if(req.body && req.body.name){
            let newSubject  = new Subject;
            newSubject.name = req.body.name;
            newSubject.faculty = [];
            newSubject.facultyNames = [];
            newSubject.faculty.push(mongoose.Types.ObjectId(req.user._id));
            newSubject.facultyNames.push(req.user.name);
            newSubject.save(err=>{
                if(err){
                    return res.status(400).send({error : err});
                }else{
                    Faculty.findOneAndUpdate({_id : mongoose.Types.ObjectId(req.user._id)},{$push : {teachingSubjects : mongoose.Types.ObjectId(newSubject._id)}},(err,doc)=>{
                        if(err){
                            return res.status(400).send({error : err.stack});
                        }else{
                            return res.status(200).send(newSubject);
                        }
                    });
                }
            })
        }else{
            return res.status(400).send({error : 'Add Payload Data!'});
        }
    }catch(err){    
        return res.status(400).send({error : err.stack});
    }
}


export function getSubjectData(req,res){
    try{
        let getAllAssignmentsPromise = getAllAssignments(req.params.subjectId);
        let getAllAnnouncementsPromise = getAnnouncements(req.params.subjectId);
        let getSubjectDataPromise  = getSubjectDetail(req.params.subjectId);
        Q.all([getAllAnnouncementsPromise,getAllAssignmentsPromise,getSubjectDataPromise]).then(data=>{
            return res.status(200).send({
                assignments : data[1],
                announcements : data[0],
                name : data[2].name,
                classCode : data[2].classCode,
                faculty : data[2].facultyNames
            })
        }).catch(err=>{
            return res.status(400).send({error : err});
        })
    }catch(err){
        return res.status(400).send({error: err});
    }
}


// export function getUserAssignments(req,res){
//     try{
//         if(req.user){
            
//         }else{
//             throw 'Request User Object Missing';
//         }
//     }catch(err){
//         return res.status(400).send({error : err.stack});
//     }
// }