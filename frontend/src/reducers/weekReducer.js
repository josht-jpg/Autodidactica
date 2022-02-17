import {
  DAYS_OF_WEEK_REQUEST,
  DAYS_OF_WEEK_SUCCESS,
  DAYS_OF_WEEK_FAIL,
} from "../constants/weekConstants";

export const daysOfWeekReducer = (state = { days: [] }, action) => {
  switch (action.type) {
    case DAYS_OF_WEEK_REQUEST:
      return { loading: true, days: [] };
    case DAYS_OF_WEEK_SUCCESS:
      return { loading: false, days: action.payload };
    case DAYS_OF_WEEK_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
