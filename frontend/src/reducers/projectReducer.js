import {
  ADD_PROJECT_FAIL,
  ADD_PROJECT_REQUEST,
  ADD_PROJECT_SUCCESS,
  REMOVE_PROJECT_FAIL,
  REMOVE_PROJECT_REQUEST,
  REMOVE_PROJECT_SUCCESS,
  PROJECT_LIST_FAIL,
  PROJECT_LIST_REQUEST,
  PROJECT_LIST_SUCCESS,
  GET_PROJECT_DATA_REQUEST,
  GET_PROJECT_DATA_SUCCESS,
  GET_PROJECT_DATA_FAIL,
} from "../constants/projectConstants";

export const projectListReducer = (state = { projects: [] }, action) => {
  switch (action.type) {
    case PROJECT_LIST_REQUEST:
      return { loading: true, projects: [] };
    case PROJECT_LIST_SUCCESS:
      return { loading: false, projects: action.payload };
    case PROJECT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addProjectReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_PROJECT_REQUEST:
      return { loading: true };
    case ADD_PROJECT_SUCCESS:
      return { loading: false, project: action.payload };
    case ADD_PROJECT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const removeProjectReducer = (state = {}, action) => {
  switch (action.type) {
    case REMOVE_PROJECT_REQUEST:
      return { loading: true };
    case REMOVE_PROJECT_SUCCESS:
      return { loading: false, projectInfo: action.payload };
    case REMOVE_PROJECT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const projectDataReducer = (state = { data: {} }, action) => {
  switch (action.type) {
    case GET_PROJECT_DATA_REQUEST:
      return { loading: true, data: {} };
    case GET_PROJECT_DATA_SUCCESS:
      return { loading: false, data: action.payload };
    case GET_PROJECT_DATA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
