import * as types from '../actions/actionTypes';
import initialState from './initialState';

export function loggedInUserReducer(state=initialState.checkForLoggedInUser,action){
    if(action.type === types.CHECKING_FOR_LOGGED_IN_USER) return true;
    if(action.type === types.CHECKING_FOR_LOGGED_IN_USER_FAILURE || action.type === types.CHECKING_FOR_LOGGED_IN_USER_SUCCESS) return false;
    return state;
}