import initialState from "./initialState";
import * as types from '../actions/actionTypes';


export default function assignmentReducer(state=initialState.schedule,action){
    switch(action.type){
        case types.GET_MY_SCHEDULE_SUCCESS : {
            return action.schedule;
        }
        case types.SCHEDULE_CLASS_SUCCESS : {
            let userInfo = JSON.parse(JSON.stringify(state));
            userInfo.unshift(action.schedule);
            return userInfo;
        }
        default : return state;
    }
}