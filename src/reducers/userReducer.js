import {
  GET_USER_INFO_FAIL,
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_SUCCESS,
  GOOGLE_SIGN_IN_FAIL,
  GOOGLE_SIGN_IN_REQUEST,
  GOOGLE_SIGN_IN_SUCCESS,
  GOOGLE_SIGN_UP_FAIL,
  GOOGLE_SIGN_UP_REQUEST,
  GOOGLE_SIGN_UP_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, isValid: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const googleAuthReducer = (state = {}, action) => {
  switch (action.type) {
    case GOOGLE_SIGN_IN_REQUEST:
      return { loading: true };
    case GOOGLE_SIGN_IN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case GOOGLE_SIGN_IN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const googleRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case GOOGLE_SIGN_UP_REQUEST:
      return { loading: true };
    case GOOGLE_SIGN_UP_SUCCESS:
      return { loading: false, isValid: true, userInfo: action.payload };
    case GOOGLE_SIGN_UP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_INFO_REQUEST:
      return { loading: true };
    case GET_USER_INFO_SUCCESS:
      return { loading: false };
    case GET_USER_INFO_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
