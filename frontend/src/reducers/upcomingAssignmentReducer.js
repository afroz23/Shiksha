import initialState from "./initialState";
import * as types from '../actions/actionTypes';


export default function upcomingAssignmnetsReducer(state=initialState.upcomingAssignments,action){
    switch(action.type){
        case types.GET_MY_UPCOMING_ASSIGNMENTS_SUCCESS  : {
            return action.assignments;
        }
        default : return state;
    }
}