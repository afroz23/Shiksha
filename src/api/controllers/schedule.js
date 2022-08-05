import mongoose from 'mongoose';
import Schedule from '../models/schedule';

export function scheduleClass(req,res){
    try{
        if(req.body && req.body.subjectId && req.body.scheduledAt){
            let newSchedule = new Schedule;
            newSchedule.subjectId = mongoose.Types.ObjectId(req.body.subjectId);
            newSchedule.scheduledAt = req.body.scheduledAt;
            newSchedule.subjectName = req.body.subjectName
            newSchedule.save((err,doc)=>{
                if(err) throw err;
                else{
                    return res.status(200).send(doc);
                }
            })
        }else{
            throw "Missing Fields";
        }
    }catch(err){
        return res.status(400).send({error : err});
    }
}


export function getSchedule(req,res){
    try{
        if(req.user){
            Schedule.find({subjectId : { $in : req.user.activeClasses}}).populate({path : 'subjectId',model : 'Subject',select :  {name : 1,classCode : 1 }}).sort({scheduledAt : 1}).then(oSched=>{
                return res.status(200).send(oSched);
            }).catch(err=>{
                return res.status(400).send({error : err});
            })
        }else{
            throw "Missing Fields";
        }
    }catch(err){
        return res.status(400).send({error : err.stack});
    }
}

export function getFacultySchedule(req,res){
    try{
        Schedule.find({subjectId : {$in : req.user.teachingSubjects}}).then(oSchedule=>{
            return res.status(200).send(oSchedule);
        }).catch(err=>{
            return res.status(400).send({error : err.stack});
        })
    }catch(err){
        return res.status(400).send({error : err.stack});
    }
}