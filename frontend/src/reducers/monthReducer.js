import {
  WEEKS_OF_MONTH_REQUEST,
  WEEKS_OF_MONTH_SUCCESS,
  WEEKS_OF_MONTH_FAIL,
} from "../constants/monthConstants";

export const weeksOfMonthReducer = (state = { weeks: [] }, action) => {
  switch (action.type) {
    case WEEKS_OF_MONTH_REQUEST:
      return { loading: true, weeks: [] };
    case WEEKS_OF_MONTH_SUCCESS:
      return { loading: false, weeks: action.payload };
    case WEEKS_OF_MONTH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
