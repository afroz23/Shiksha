// all the annnouncement related controllers
import mongoose from 'mongoose';
import Announcement from '../models/announcement';
import Q, { defer } from 'q';
export function AddAnouncement(req,res){
    try{
        if(req.body && req.body.content && req.body.subjectId){
            let newAnnouncement = new Announcement;
            newAnnouncement.content = req.body.content;
            newAnnouncement.subjectId = mongoose.Types.ObjectId(req.body.subjectId);
            newAnnouncement.postedBy = req.user.name;
            newAnnouncement.save((err,doc)=>{
                if(err){
                    return res.status(400).send(err.stack);
                }else{
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


export function getAnnouncements(subjectId){
    let deferred = Q.defer();
    Announcement.find({subjectId : mongoose.Types.ObjectId(subjectId)}).sort({_id : -1}).then(oAnnouncements=>{
        deferred.resolve(oAnnouncements);
    }).catch(err=>{
        deferred.reject(err);
    })
    return deferred.promise;
}
