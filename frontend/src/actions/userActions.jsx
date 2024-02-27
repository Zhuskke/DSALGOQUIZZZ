import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_VERIFY_OTP_REQUEST,
  USER_VERIFY_OTP_SUCCESS,
  USER_VERIFY_OTP_FAIL,
  USER_RESEND_OTP_REQUEST,
  USER_RESEND_OTP_SUCCESS,
  USER_RESEND_OTP_FAIL,
  USER_CONFIRM_CHANGE_PASSWORD_FAIL,
  USER_CONFIRM_CHANGE_PASSWORD_REQUEST,
  USER_CONFIRM_CHANGE_PASSWORD_SUCCESS,
  USER_SEND_CHANGE_PASSWORD_REQUEST,
  USER_SEND_CHANGE_PASSWORD_FAIL,
  USER_SEND_CHANGE_PASSWORD_SUCCESS,
} from "../constants/userConstants";
import axios from "axios";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/login/",
      { username: email, password: password },
      config
    );
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
};

export const register = (username, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/register/",
      { username, email, password }, 
      config
    );

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data, // Return the response data from the API call
    });

    // dispatch({
    //   type: USER_LOGIN_SUCCESS,
    //   payload: data,
    // });

    return data; // Return the response data
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    return null;
  }
};

export const verifyOTP = (userId, otp) => async (dispatch) => {
  try {
    dispatch({
      type: USER_VERIFY_OTP_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/verify-otp/",
      { user_id: userId, otp: otp },
      config
    );

    dispatch({
      type: USER_VERIFY_OTP_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_VERIFY_OTP_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};


export const resendOTP = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: USER_RESEND_OTP_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/resend-otp/",
      { user_id: userId },
      config
    );

    dispatch({
      type: USER_RESEND_OTP_SUCCESS,
      payload: data,
    });

  } catch (error) {
    console.log("Error occurred during resendOTP:", error); // Add this line
    dispatch({
      type: USER_RESEND_OTP_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const sendChangepassword = (password, password2, token) => async (dispatch) => {
  try {
      dispatch({ type: USER_SEND_CHANGE_PASSWORD_REQUEST });
      const config = {
          headers: {
              'Content-Type': 'application/json',
          },
      };
      const { data } = await axios.post(
          'http://127.0.0.1:8000/api/changepassword/',
          { password, password2 },
          config
      );
      dispatch({
          type: USER_SEND_CHANGE_PASSWORD_SUCCESS,
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: USER_SEND_CHANGE_PASSWORD_FAIL,
          payload: error.response && error.response.data.details
              ? error.response.data.details
              : error.message,
      });
  }
};

export const confirmChangepassword = (password, password2, uid, token) => async (dispatch) => {
  try {
      dispatch({ type: USER_CONFIRM_CHANGE_PASSWORD_REQUEST });
      const config = {
          headers: {
              'Content-Type': 'application/json',
          },
      };
      const { data } = await axios.post(
          `http://127.0.0.1:8000/api/reset-password/${uid}/${token}`,
          { password, password2 },
          config
      );
      dispatch({
          type: USER_CONFIRM_CHANGE_PASSWORD_SUCCESS,
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: USER_CONFIRM_CHANGE_PASSWORD_FAIL,
          payload: error.response && error.response.data.details
              ? error.response.data.details
              : error.message,
      });
  }
}