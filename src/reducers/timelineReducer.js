import {
  ADD_UNIT_FAIL,
  ADD_UNIT_REQUEST,
  ADD_UNIT_SUCCESS,
  GET_UNIT_DATA_FAIL,
  GET_UNIT_DATA_REQUEST,
  GET_UNIT_DATA_SUCCESS,
  TIMELINE_DATA_FAIL,
  TIMELINE_DATA_REQUEST,
  TIMELINE_DATA_SUCCESS,
} from "../constants/timelineConstants";

export const unitDataReducer = (state = { unit: {} }, action) => {
  switch (action.type) {
    case GET_UNIT_DATA_REQUEST:
      return { loading: true, unit: {} };
    case GET_UNIT_DATA_SUCCESS:
      return { loading: false, unit: action.payload };
    case GET_UNIT_DATA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const timelineScreenReducer = (state = {}, action) => {
  switch (action.type) {
    case TIMELINE_DATA_REQUEST:
      return { loading: true };
    case TIMELINE_DATA_SUCCESS:
      return { loading: false, units: action.payload };
    case TIMELINE_DATA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addUnitReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_UNIT_REQUEST:
      return { loading: true };
    case ADD_UNIT_SUCCESS:
      return {
        loading: false,
        unit: action.payload && action.payload.unit,
        newUnit: action.payload && action.payload.newUnit,
      };
    case ADD_UNIT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
