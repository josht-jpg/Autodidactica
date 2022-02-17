import axios from "axios";
import {
  MESSAGE_FAIL,
  MESSAGE_REQUEST,
  MESSAGE_SUCCESS,
} from "../constants/messageConstants";

export const sendMessage =
  (message, messageType) => async (dispatch, getState) => {
    try {
      dispatch({
        type: MESSAGE_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/message/${messageType}`,
        { message },
        config
      );

      dispatch({
        type: MESSAGE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: MESSAGE_FAIL,
        payload:
          error.responce && error.responsce.data.message
            ? error.message.data.message
            : error.message,
      });
    }
  };
