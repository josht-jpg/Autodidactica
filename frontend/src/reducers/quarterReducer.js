import {
  MONTHS_OF_QUARTER_REQUEST,
  MONTHS_OF_QUARTER_SUCCESS,
  MONTHS_OF_QUARTER_FAIL,
} from "../constants/quarterConstants";

export const monthsOfQuarterReducer = (state = { months: [] }, action) => {
  switch (action.type) {
    case MONTHS_OF_QUARTER_REQUEST:
      return { loading: true, months: [] };
    case MONTHS_OF_QUARTER_SUCCESS:
      return { loading: false, months: action.payload };
    case MONTHS_OF_QUARTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
