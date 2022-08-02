import * as types from './actionTypes';

export function beginCheckForLoggedInUser(){
    return {type:types.CHECKING_FOR_LOGGED_IN_USER};
}

export function checkForLoggedInUserSuccess(){
    return {type : types.CHECKING_FOR_LOGGED_IN_USER_FAILURE};
}

export function checkForLoggedInUserFailure(){
    return {type : types.CHECKING_FOR_LOGGED_IN_USER_FAILURE};
}