import {
  ADD_SUBJECT_FAIL,
  ADD_SUBJECT_REQUEST,
  ADD_SUBJECT_SUCCESS,
  LIST_SUBJECT_FAIL,
  LIST_SUBJECT_REQUEST,
  LIST_SUBJECT_SUCCESS,
} from "../constants/subjectConstants";

export const listSubjectsReducer = (state = { subjects: [] }, action) => {
  switch (action.type) {
    case LIST_SUBJECT_REQUEST:
      return { loading: true };
    case LIST_SUBJECT_SUCCESS:
      return { loading: false, subjects: action.payload };
    case LIST_SUBJECT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addSubjectReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_SUBJECT_REQUEST:
      return { loading: true };
    case ADD_SUBJECT_SUCCESS:
      return { loading: false, subjectInfo: action.payload };
    case ADD_SUBJECT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
