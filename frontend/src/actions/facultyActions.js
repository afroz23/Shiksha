import {api} from '../utilities';
import * as types from './actionTypes';

const options = {
    "Content-Type" : "application/json",
    "AccessToken" : localStorage.getItem('AccessToken')
}
export function loginUserSuccess(user){
    return {type : types.LOGIN_USER_SUCCESS , user};
}

export function createSubjectSuccess(subject){
    return {type : types.CREATE_SUBJECT_SUCCESS , subject};
}

export function postAssigmentSuccess(assignment){
    return {type : types.POST_ASSIGNMENT_SUCCESS , assignment};
}

export function postScheduleSuccess(schedule){
    return {type : types.SCHEDULE_CLASS_SUCCESS , schedule};
}

export function login(userInfo){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.FACULTY_LOGIN_URL,{
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
        return fetch(api.BASE_URL + api.FACULTY_SIGNUP_URL,{
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

export function createSubject(userInfo){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.CREATE_SUBJECT_URL,{
            method : 'post',
            headers : options,
            body : JSON.stringify(userInfo)
        }).then(function(response){
            return response.json();
        }).then(data=>{
            if(data.error){
                throw data.error;
            }
            dispatch(createSubjectSuccess(data));
            return data;
        })
    } 
}


export function postAssignment(userData){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.POST_ASSIGNMENT_URL,{
            method : 'post',
            headers :options,
            body : JSON.stringify(userData)
        }).then(function(response){
            return response.json();
        }).then(data=>{
            if(data.error){
                throw data.error;
            }
            dispatch(postAssigmentSuccess(data));
            return data;
        })
    }
}


export function postAnnouncement(userData){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.POST_ANNOUNCEMENT_URL,{
            method : 'post',
            headers : options,
            body : JSON.stringify(userData)
        }).then(function(response){
            return response.json();
        }).then(data=>{
            if(data.error){
                throw data.error;
            }
            return data;
        })
    }
}


export function postSchedule(userData){
    return function(dispatch,getState){
        return fetch(api.BASE_URL + api.SCHEDULE_CLASS_URL , {
            method : 'post',
            headers : options,
            body:JSON.stringify(userData)
        }).then(function(response){
            return response.json();
        }).then(data=>{
            if(data.error){
                throw data.error;
            }
            dispatch(postScheduleSuccess(data));
            return data;
        })
    }
}