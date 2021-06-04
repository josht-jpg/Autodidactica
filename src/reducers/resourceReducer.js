import {
  ADD_RESOURCE_FAIL,
  ADD_RESOURCE_REQUEST,
  ADD_RESOURCE_SUCCESS,
  BOOK_LIST_FAIL,
  BOOK_LIST_REQUEST,
  BOOK_LIST_SUCCESS,
  COURSE_LIST_FAIL,
  COURSE_LIST_REQUEST,
  COURSE_LIST_SUCCESS,
  EDIT_RESOURCE_TEXT_DATA_FAIL,
  EDIT_RESOURCE_TEXT_DATA_REQUEST,
  EDIT_RESOURCE_TEXT_DATA_SUCCESS,
  GET_RESOURCE_DATA_FAIL,
  GET_RESOURCE_DATA_REQUEST,
  GET_RESOURCE_DATA_SUCCESS,
  REMOVE_RESOURCE_FAIL,
  REMOVE_RESOURCE_REQUEST,
  REMOVE_RESOURCE_SUCCESS,
} from "../constants/resourceConstants";

export const resourceDataReducer = (state = { data: {} }, action) => {
  switch (action.type) {
    case GET_RESOURCE_DATA_REQUEST:
      return { loading: true, data: {} };
    case GET_RESOURCE_DATA_SUCCESS:
      return { loading: false, data: action.payload };
    case GET_RESOURCE_DATA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const bookListReducer = (state = { books: [] }, action) => {
  switch (action.type) {
    case BOOK_LIST_REQUEST:
      return { loading: true, books: [] };
    case BOOK_LIST_SUCCESS:
      return { loading: false, books: action.payload };
    case BOOK_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const courseListReducer = (state = { courses: [] }, action) => {
  switch (action.type) {
    case COURSE_LIST_REQUEST:
      return { loading: true, courses: [] };
    case COURSE_LIST_SUCCESS:
      return { loading: false, courses: action.payload };
    case COURSE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addResourceReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_RESOURCE_REQUEST:
      return { loading: true };
    case ADD_RESOURCE_SUCCESS:
      return { loading: false, resource: action.payload };
    case ADD_RESOURCE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const removeResourceReducer = (state = {}, action) => {
  switch (action.type) {
    case REMOVE_RESOURCE_REQUEST:
      return { loading: true };
    case REMOVE_RESOURCE_SUCCESS:
      return { loading: false, resourceInfo: action.payload };
    case REMOVE_RESOURCE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const editResourceTextDataReducer = (state = {}, action) => {
  switch (action.type) {
    case EDIT_RESOURCE_TEXT_DATA_REQUEST:
      return { loading: true };
    case EDIT_RESOURCE_TEXT_DATA_SUCCESS:
      return { loading: false, resourceData: action.payload };
    case EDIT_RESOURCE_TEXT_DATA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
