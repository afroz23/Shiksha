// all the assignment related controllers
import mongoose from 'mongoose';
import Q from 'q';
import AssignmentPost from '../models/assignmentPost';
import Assignment from '../models/assignment';
import Student from '../models/student';
export function getAllAssignments(subjectId){
    let deferred = Q.defer();
    AssignmentPost.find({subjectId : mongoose.Types.ObjectId(subjectId)}).sort({_id : -1}).then(oAsg=>{
        deferred.resolve(oAsg);
    }).catch(err=>{
        deferred.reject(err);
    })
    return deferred.promise;
}


export function addAssignment(req,res){
    try{
        if(req.body && req.body.name && req.body.deadline && req.body.content && req.body.subjectId){
            let newAssignment = new AssignmentPost;
            newAssignment.name = req.body.name;
            // newAssignment.deadline = new Date();
            newAssignment.deadline = new Date(req.body.deadline);
            newAssignment.content = req.body.content;
            newAssignment.subjectId = mongoose.Types.ObjectId(req.body.subjectId);
            newAssignment.save((err,doc)=>{
                if(err){
                    throw err;
                }else{
                    return res.status(200).send(newAssignment);
                }
            })
        }else{
            throw "Missing Fields";
        }
    }catch(err){
        return res.status(400).send({error : err});
    }
}

export function submitAssignment(req,res){
    try{
        if(req.body && req.body.submissionLink && req.body.assignmentPostId){
            let submissionPostPromise = AssignmentPost.findOne({_id : mongoose.Types.ObjectId(req.body.assignmentPostId)});
            let newSubmission = new Assignment;
            newSubmission.submissionLink = req.body.submissionLink;
            newSubmission.assignmentPostId = mongoose.Types.ObjectId(req.body.assignmentPostId);
            Q.all([submissionPostPromise]).then(data=>{
                newSubmission.lateSubmission = data[0].deadline < Date.now();
                newSubmission.subjectId = data[0].subjectId;
                newSubmission.submittedName = req.user.name;
                newSubmission.submittedBy = mongoose.Types.ObjectId(req.user._id);
                newSubmission.save((err,doc)=>{
                    if(err){
                        return res.status(400).send({error : err});
                    }else{
                        Student.findByIdAndUpdate(mongoose.Types.ObjectId(req.user._id),{push : {CompletedAssignments : req.body.assignmentPostId}},(err,resp)=>{
                            if(err){
                                return res.status(400).send({error : err});
                            }else{
                                return res.status(200).send(doc);                                
                            }
                        })
                    }
                })
            }).catch(err=>{
                return res.status(400).send({error : err});
            })
        }else{
            throw 'Missing Fields'
        } 
    }catch(err){
        return res.status(400).send({error : err});
    }
}



export function getUpcomingAssignments(req,res){
    try{
        let compAssignments = req.user.CompletedAssignments.map(oAsg=>
            mongoose.Types.ObjectId(oAsg))
        AssignmentPost.find({deadline : {$gte : Date()},subjectId : {$in : req.user.activeClasses} , _id : {$nin : compAssignments} }).then(oAsg=>{
            return res.status(200).send(oAsg);
        }).catch(err=>{
            return res.status(400).send({error : err.stack});
        })
    }catch(err){
        return res.status(400).send({error : err.stack});
    }
}


export function getAssignments(req,res){
    try{
        let assignmentPostId = req.params.assignmentPostId;
        Assignment.find({subjectId : {$in : req.user.teachingSubjects},assignmentPostId :mongoose.Types.ObjectId(assignmentPostId)}).then(docs=>{
            return res.status(200).send(docs);
        }).catch(err=>{
            return res.status(400).send({error : err.stack});
        })
    }catch(err){
        return res.status(400).send({error : err});
    }
}


export function assignMark(req,res){
    try{
        if(req.body && req.body.submittedBy && req.body.assignmentPostId && req.body.marks){
            Assignment.findOneAndUpdate({submittedBy : mongoose.Types.ObjectId(req.body.submittedBy) , assignmentPostId : mongoose.Types.ObjectId(req.body.assignmentPostId) },{$set : {marksAlloted : req.body.marks}},(err,docs)=>{
                if(err){
                    return res.status(400).send({error : err.stack});
                }else{
                    return res.status(200).send(docs);
                }
            })
        }else{
            throw 'Missing Fields';
        }
    }catch(err){
        return res.status(400).send({error : err.stack});
    }
}

export function getAssignmentData(req,res){
    try{
        AssignmentPost.findOne({_id: mongoose.Types.ObjectId(req.params.ann_id)}).then(oAsg=>{
            return res.status(200).send(oAsg)
        }).catch(err=>{
            return  res.status(400).send({error : err.stack});
        })
    }catch(err){
        return res.status(400).send({error: err.stack});
    }
}


export function getStudentAssignmentData(req,res){
    try{
        Assignment.findOne({submittedBy  : req.user._id , assignmentPostId : req.params.assignmentPostId}).then(oAssign=>{
            return res.status(200).send(oAssign);
        }).catch(err=>{
            return res.status(400).send({error: err.stack});
        })
    }catch(err){
        return res.status(400).send({error : err.stack});
    }
}