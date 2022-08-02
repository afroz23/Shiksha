import mongoose from 'mongoose';

const AssignmentPostSchema = mongoose.Schema({
    name : { 
        type:String,
    },
    deadline : {
        type:Date
    },
    postedOn  : {
        type : Date,
        default : Date.now
    },
    content : {
        type:String
    },
    subjectId : {
        type : mongoose.Types.ObjectId,
        ref : 'Subject'
    }
})


export default mongoose.model('AssignmentPost',AssignmentPostSchema);