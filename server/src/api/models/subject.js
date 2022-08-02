import mongoose from 'mongoose';
import randtoken from 'rand-token';



const SubjectSchema = mongoose.Schema({
    name : {
        type:String,
        required : true
    },
    classCode : {
        type:String,
        default : function(){
            return randtoken.generate(5)
        },
        unique : true
    },
    faculty : [{
        type:mongoose.Types.ObjectId,
        ref: 'Faculty'
    }],
    facultyNames : [{type:String}],
    Students : [{
        type:mongoose.Types.ObjectId,
        ref: 'Student'
    }],
    isValid : {
        type : Boolean,
        default : true
    }
})


export default mongoose.model('Subject',SubjectSchema);