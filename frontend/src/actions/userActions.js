import {
  DELETE_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  GET_USER_INFO_FAIL,
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
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
      "/api/users/login",
      { email, password },
      config
    );

    localStorage.setItem("userInfo", JSON.stringify(data));
    data.currentSubject &&
      localStorage.setItem("subject", JSON.stringify(data.currentSubject));

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.clear();
  sessionStorage.clear();
  dispatch({
    type: USER_LOGOUT,
  });
};

export const register = (name, email, password) => async (dispatch) => {
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
      "/api/users",
      { name, email, password },
      config
    );

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const deleteUser = () => async (dispatch, getState) => {
  localStorage.clear();
  sessionStorage.clear();

  try {
    dispatch({
      type: DELETE_USER_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete("/api/users/", config);

    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload:
        error.responce && error.responsce.data.message
          ? error.message.data.message
          : error.message,
    });
  }
};

export const getUserInfo = (token) => async (dispatch) => {
  try {
    dispatch({
      type: GET_USER_INFO_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get("/api/users/info", config);

    localStorage.setItem("userInfo", JSON.stringify(data));
    data.currentSubject &&
      localStorage.setItem("subject", JSON.stringify(data.currentSubject));

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    dispatch({ type: GET_USER_INFO_SUCCESS });

    window.location.href.includes("dashboard") && window.location.reload();
  } catch (error) {
    dispatch({
      type: GET_USER_INFO_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};
