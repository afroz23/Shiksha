// all the faculty related controllers
import Faculty from '../models/faculty';
import { emailContexts,validateUserEmail,sendEmail ,validateUser} from "./apiHelper";
import fetch from 'node-fetch';
import Subject from '../models/subject';

export function signup(req,res){
    try{
        let userInfo = req.body;
        userInfo.email = userInfo.email.toLowerCase();
        if(!userInfo.email || !userInfo.password || !userInfo.name || userInfo.password.length<8){
            if(userInfo.password.length < 8){
                res.status(422);
                return res.send({error:"Password Too Short"});
            }else{
                res.status(400);
                return res.send({error :"Required Fields Error"});
            }
        }
        fetch(`https://open.kickbox.com/v1/disposable/${userInfo.email}`).then(function (response) {
                return response.json();
            }).then(function(isDisposedData){
                if(!isDisposedData.disposable){
                    validateUserEmail(userInfo.email,false,true).then(isValid=>{
                        if(isValid){
                            let newFaculty = new  Faculty;
                            newFaculty.name = userInfo.name;
                            newFaculty.email = userInfo.email;
                            newFaculty.password = newFaculty.generateHash(userInfo.password);
                            newFaculty.save(function(err){
                                if(err){
                                    return res.status(400).send({error:err.stack});
                                }else{
                                    sendEmail(userInfo.email,emailContexts.WELCOME).then((isValid)=>{
                                        res.status(200).send({message : 'User Created!'});
                                    }).catch(err=>{
                                        return res.status(400).send(err);
                                    })
                                }
                            })
                        }else{
                            return res.status(400).send({error : 'Error Occured'});
                        }
                    }).catch(err=>{
                        return res.status(400).send({error : err.stack});
                    })
                }else{
                    return res.status(500).send({error : 'Error Saving the info!'});
                }
            }).catch(err=>{
                return res.status(400).send(err.stack);
            })
    }catch(err){
        return res.status(400).send(err.stack);
    }
}



export function login(req,res){
    try{
        let userInfo = req.body;
        if(!userInfo || !userInfo.email || !userInfo.password){
            return res.status(400).send({error : 'Missing Fields!'});
        }
        Faculty.findOne({
            email : userInfo.email
        }).then(user=>{
            if(user.validPassword(userInfo.password)){
                validateUser(req,res,user,true);
            }else{
                return res.status(404).send({error:'Password Invalid!'});
            }
        }).catch(err=>{
            console.log(err);
            return res.status(400).send({error : err.stack});
        })
    }catch(err){
        return res.status(400).send({error : err.stack});
    }
}


export function getAllSubjects(req,res){
    try{    
        if(req.user){
            Subject.find({_id : {$in : req.user.teachingSubjects}}).then(oSub=>{
                return res.status(200).send(oSub);
            }).catch(err=>{
                return res.status(400).send({error : err.stack});
            })
        }else{
            throw 'Request User Missing';
        }
    }catch(err){
        return res.status(400).send({error : err});
    }
}