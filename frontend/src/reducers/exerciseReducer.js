import {
  ADD_EXERCISE_FAIL,
  ADD_EXERCISE_REQUEST,
  ADD_EXERCISE_SUCCESS,
  EDIT_EXERCISE_TEXT_DATA_FAIL,
  EDIT_EXERCISE_TEXT_DATA_REQUEST,
  EDIT_EXERCISE_TEXT_DATA_SUCCESS,
  EXERCISE_LIST_FAIL,
  EXERCISE_LIST_REQUEST,
  EXERCISE_LIST_SUCCESS,
} from "../constants/exerciseConstants";

export const exerciseListReducer = (state = { exercises: [] }, action) => {
  switch (action.type) {
    case EXERCISE_LIST_REQUEST:
      return { loading: true, exercises: [] };
    case EXERCISE_LIST_SUCCESS:
      return { loading: false, exercises: action.payload };
    case EXERCISE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addExerciseReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_EXERCISE_REQUEST:
      return { loading: true };
    case ADD_EXERCISE_SUCCESS:
      return { loading: false, exercise: action.payload };
    case ADD_EXERCISE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const editExerciseTextDataReducer = (state = {}, action) => {
  switch (action.type) {
    case EDIT_EXERCISE_TEXT_DATA_REQUEST:
      return { loading: true };
    case EDIT_EXERCISE_TEXT_DATA_SUCCESS:
      return { loading: false, exerciseData: action.payload };
    case EDIT_EXERCISE_TEXT_DATA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
