import {combineReducers} from 'redux';
import * as types from '../actions/actionTypes';
import { loggedInUserReducer as checkingForLoggedinUser } from './loggedInUserReducer';
import user from './userReducer';
import studentAssignments from './studentAssignmentReducer';
import facultyAssignments from './facultyAssignmentReducer';
import studentSubjects from './StudentSubjectReducer';
import facultySubjects from './facultySubjectReducer';
import schedule from './scheduleReducer';
import upcomingAssignments from './upcomingAssignmentReducer';
const appReducer = combineReducers({
    user,
    checkingForLoggedinUser,
    facultyAssignments,
    facultySubjects,
    studentAssignments,
    studentSubjects,
    schedule,
    upcomingAssignments
});

const rootReducer = (state,action)=>{
    if(action.type === types.LOGOUT_USER_SUCCESS){
        state = undefined;
    }
    return appReducer(state,action);
}

export default rootReducer;