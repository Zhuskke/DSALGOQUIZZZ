import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import { userLoginReducer, userRegisterReducer, userSendChangepasswordReducer, userConfirmChangepasswordReducer, userVerifyOTPReducer } from './reducers/userReducers';


const reducer = combineReducers({
    // Add your reducers here
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    usersendChangepassword: userSendChangepasswordReducer,
    userConfirmChangepassword: userConfirmChangepasswordReducer,
    userVerifyOTP: userVerifyOTPReducer,
    // userResendOtp, userResendOtpReducer,
});


const userInfoFromStorage = localStorage.getItem('userInfo') ? 
    JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    // Add your initial states here
    userLogin: { userInfo: userInfoFromStorage },
};


const store = configureStore({
    reducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});


export default store;
