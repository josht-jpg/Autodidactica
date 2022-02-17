import axios from "axios";
import {
  GET_REMOVED_ITEMS_REQUEST,
  GET_REMOVED_ITEMS_SUCCESS,
  GET_REMOVED_ITEMS_FAIL,
  RESTORE_ITEM_REQUEST,
  RESTORE_ITEM_SUCCESS,
  RESTORE_ITEM_FAIL,
  PERMANENTLY_DELETE_ITEM_REQUEST,
  PERMANENTLY_DELETE_ITEM_SUCCESS,
  PERMANENTLY_DELETE_ITEM_FAIL,
} from "../constants/trashConstants";

export const getRemovedItems = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_REMOVED_ITEMS_REQUEST });

    const {
      userLogin: { userInfo },
      addSubject: { subjectInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        Subject: subjectInfo._id,
      },
    };

    const { data } = await axios.get("/api/trash/items", config);

    dispatch({
      type: GET_REMOVED_ITEMS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_REMOVED_ITEMS_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const restoreItem = (type, id) => async (dispatch, getState) => {
  try {
    dispatch({ type: RESTORE_ITEM_REQUEST });

    const {
      userLogin: { userInfo },
      addSubject: { subjectInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        Subject: subjectInfo._id,
      },
    };

    const { data } = await axios.post(
      "/api/trash/restore",
      { type, id },
      config
    );

    dispatch({
      type: RESTORE_ITEM_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: RESTORE_ITEM_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const permanentlyDeleteItem =
  (type, id) => async (dispatch, getState) => {
    try {
      dispatch({ type: PERMANENTLY_DELETE_ITEM_REQUEST });

      const {
        userLogin: { userInfo },
        addSubject: { subjectInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          Subject: subjectInfo._id,
          item_type: type,
          item_id: id,
        },
      };

      const { data } = await axios.delete("/api/trash/items", config);

      dispatch({
        type: PERMANENTLY_DELETE_ITEM_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: PERMANENTLY_DELETE_ITEM_FAIL,
        payload:
          err.responce && err.message.data.message
            ? err.response.data.message
            : err.message,
      });
    }
  };
