import {
  GET_REMOVED_ITEMS_FAIL,
  GET_REMOVED_ITEMS_REQUEST,
  GET_REMOVED_ITEMS_SUCCESS,
} from "../constants/trashConstants";

export const removedItemsReducer = (state = { items: {} }, action) => {
  switch (action.type) {
    case GET_REMOVED_ITEMS_REQUEST:
      return { loading: true, items: {} };
    case GET_REMOVED_ITEMS_SUCCESS:
      return { loading: false, items: action.payload };
    case GET_REMOVED_ITEMS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
