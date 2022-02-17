import {
  ADD_GOAL_FAIL,
  ADD_GOAL_REQUEST,
  ADD_GOAL_SUCCESS,
  REMOVE_GOAL_FAIL,
  REMOVE_GOAL_REQUEST,
  REMOVE_GOAL_SUCCESS,
  GOAL_LIST_FAIL,
  GOAL_LIST_REQUEST,
  GOAL_LIST_SUCCESS,
  CHANGE_STATUS_REQUEST,
  CHANGE_STATUS_SUCCESS,
  CHANGE_STATUS_FAIL,
  GET_ADD_GOAL_SCREEN_DATA_REQUEST,
  GET_ADD_GOAL_SCREEN_DATA_SUCCESS,
  GET_ADD_GOAL_SCREEN_DATA_FAIL,
} from "../constants/goalConstants";

export const goalListReducer = (state = { goals: [] }, action) => {
  switch (action.type) {
    case GOAL_LIST_REQUEST:
      return { loading: true, goals: [] };
    case GOAL_LIST_SUCCESS:
      return { loading: false, goals: action.payload };
    case GOAL_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addGoalReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_GOAL_REQUEST:
      return { loading: true };
    case ADD_GOAL_SUCCESS:
      return { loading: false, goal: action.payload };
    case ADD_GOAL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addGoalScreenDataReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ADD_GOAL_SCREEN_DATA_REQUEST:
      return { loading: true };
    case GET_ADD_GOAL_SCREEN_DATA_SUCCESS:
      return {
        loading: false,
        projects: action.payload.projects,
        books: action.payload.books,
        exercises: action.payload.exercises,
        goals: action.payload.goals,
        timelineTitles: action.payload.timelineTitles,
      };
    case GET_ADD_GOAL_SCREEN_DATA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const updateStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_STATUS_REQUEST:
      return { loading: true };
    case CHANGE_STATUS_SUCCESS:
      return { loading: false, status: action.payload };
    case CHANGE_STATUS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const removeGoalReducer = (state = {}, action) => {
  switch (action.type) {
    case REMOVE_GOAL_REQUEST:
      return { loading: true };
    case REMOVE_GOAL_SUCCESS:
      return { loading: false, goalInfo: action.payload };
    case REMOVE_GOAL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
