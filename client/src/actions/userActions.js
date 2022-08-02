import {api} from '../utilities';
import {beginCheckForLoggedInUser,checkForLoggedInUserSuccess,checkForLoggedInUserFailure} from './statusActions';
import * as types from './actionTypes';

const options = {
    "Content-Type" : "application/json",
    "AccessToken" : localStorage.getItem('AccessToken')
}

export function loginUserSuccess(user){
    return {type : types.LOGIN_USER_SUCCESS , user};
}

export function joinClassSuccess(subject){
    return {type : types.JOIN_SUBJECT_SUCCESS , subject};
}

export function getTeachingSubjectsSuccess(subjects){
    return {type: types.GET_MY_TEACHING_SUBJECTS_SUCCESS , subjects};
}

export function getStudentSubjectsSuccess(subjects){
    return {type : types.GET_MY_SUBJECTS_SUCCESS , subjects};
}

export function getScheduleSuccess(schedule){
    return {type:types.GET_MY_SCHEDULE_SUCCESS ,schedule};
}

export function upcommingAssignmentsSuccess(assignments){
    return {type : types.GET_MY_UPCOMING_ASSIGNMENTS_SUCCESS , assignments }
}

export function logoutUserSucess(){
    return {type : types.LOGOUT_USER_SUCCESS };
}

export function checkForLoggedInUser(){
    return function (dispatch,getState){
        dispatch(beginCheckForLoggedInUser());
        return fetch(api.BASE_URL + api.CHECK_FOR_LOGGED_IN_USER,{
            method : 'get',
            headers: options
            }).then(function(response) {
                return response.json();
            }).then(data=>{
                if(data.error){
                    throw data.error
                }
                dispatch(checkForLoggedInUserSuccess());
                dispatch(loginUserSuccess(data));
                return data;
            }).catch(err=>{
                dispatch(checkForLoggedInUserFailure())
                throw err;
            });
    }
}


export function login(userInfo){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.STUDENT_LOGIN_URL,{
            method : 'post',
            headers : options,
            body : JSON.stringify(userInfo)
        }).then(function(response){
            return response.json();
        }).then(data=>{
            if(data.error){
                throw data.error;
            }
            dispatch(loginUserSuccess(data));
            return data;
        })
    }
}


export function signup(userInfo){
        return fetch(api.BASE_URL + api.STUDENT_SIGNUP_URL,{
            method : 'post',
            headers : options,
            body : JSON.stringify(userInfo)
        }).then(function(response){
            return response.json();
        }).then(data=>{
            if(data.error){
                throw data.error;
            }
            return data;
        })
}
export function joinSubject(userInfo){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.JOIN_SUBJECT_URL,{
            method : 'post',
            headers : options,
            body : JSON.stringify(userInfo)
        }).then(function(response){
            return response.json();
        }).then(data=>{
            if(data.error){
                throw data.error;
            }
            dispatch(joinClassSuccess(data));
            return data;
        })
    } 
}


export function getMyTeachingSubjects(){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.GET_FACULTY_SUBJECT_URL,{
            method : 'get',
            headers : options
        }).then(function(response){
            return response.json();
        }).then(data=>{
            if(data.error){
                throw data.error;
            }
            dispatch(getTeachingSubjectsSuccess(data));
            return data;
        })
    } 
}

export function getMySujects(){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.GET_STUDENTS_SUBJECT_URL,{
            method : 'get',
            headers :options
        }).then(function(response){
            return response.json();
        }).then(data=>{
            if(data.error){
                throw data.error;
            }
            dispatch(getStudentSubjectsSuccess(data));
            return data;
        })
    } 
}


export function getTeachingSchedule(){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.GET_FACULTY_SCHEDULE_URL,{
            method : 'get',
            headers :options
        }).then(function(response){
            return response.json();
        }).then(data=>{
            if(data.error){
                throw data.error;
            }
            dispatch(getScheduleSuccess(data));
            return data;
        })
    } 
}

export function getStudentSchedule(){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.GET_STUDENT_SCHEDULE_URL,{
            method : 'get',
            headers : options
        }).then(function(response){
            return response.json();
        }).then(data=>{
            if(data.error){
                throw data.error;
            }
            dispatch(getScheduleSuccess(data));
            return data;
        })
    }    
}

export function getSubjectData(subjectId){
    return fetch(api.BASE_URL + api.GET_SUBJECT_DATA_URL + subjectId , {
        method : 'get',
        headers : options
    }).then(function(response){
        return response.json();
    }).then(data=>{
        if(data.error){
            throw data.error;
        }
        return data;
    })
}

export function logoutUser(){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.LOGOUT_URL , {
            method : 'get',
            headers : options
        }).then(response=>{
            return response.json();
        }).then(result=>{
            if(result.error){
                throw result.error;
            }
            dispatch(logoutUserSucess());
            return result;
        })
    }
}


export function getUpcomingAssignments(){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.GET_UPCOMING_ASSIGNMENTS_URL,{
            method: 'get',
            headers : options
        } ).then(response=>{
            return response.json();
        }).then(result=>{
            if(result.error){
                throw result.error;
            }
            dispatch(upcommingAssignmentsSuccess(result));
            return result;
        })
    }
}