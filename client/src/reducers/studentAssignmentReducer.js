import initialState from "./initialState";
import * as types from '../actions/actionTypes';


export default function assignmentReducer(state=initialState.studentAssignments,action){
    let userObject = {};
    switch(action.type){
        case types.GET_MY_ASSIGNMENTS_SUCCESS : {
            userObject = JSON.parse(JSON.stringify(state));
            userObject.assignments = action.assignments;
            return userObject;
        }
        default : return state;
    }
}