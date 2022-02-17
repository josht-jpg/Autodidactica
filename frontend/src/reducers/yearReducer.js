import {
  YEAR_LIST_REQUEST,
  YEAR_LIST_SUCCESS,
  YEAR_LIST_FAIL,
  ADD_YEAR_REQUEST,
  ADD_YEAR_SUCCESS,
  ADD_YEAR_FAIL,
  LIST_YEARS_WITH_QUARTERS_REQUEST,
  LIST_YEARS_WITH_QUARTERS_SUCCESS,
  LIST_YEARS_WITH_QUARTERS_FAIL,
} from "../constants/yearConstants";

export const yearListReducer = (state = { years: [] }, action) => {
  switch (action.type) {
    case YEAR_LIST_REQUEST:
      return { loading: true, years: [] };
    case YEAR_LIST_SUCCESS:
      return { loading: false, years: action.payload };
    case YEAR_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addYearReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_YEAR_REQUEST:
      return { loading: true };
    case ADD_YEAR_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case ADD_YEAR_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const yearsWithQuartersReducer = (state = { years: [] }, action) => {
  switch (action.type) {
    case LIST_YEARS_WITH_QUARTERS_REQUEST:
      return { loading: true, years: [] };
    case LIST_YEARS_WITH_QUARTERS_SUCCESS:
      return { loading: false, years: action.payload };
    case LIST_YEARS_WITH_QUARTERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
