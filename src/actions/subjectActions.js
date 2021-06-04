import {
  ADD_SUBJECT_FAIL,
  ADD_SUBJECT_REQUEST,
  ADD_SUBJECT_SUCCESS,
  LIST_SUBJECT_FAIL,
  LIST_SUBJECT_REQUEST,
  LIST_SUBJECT_SUCCESS,
  UPDATE_CURRENT_SUBJECT_FAIL,
  UPDATE_CURRENT_SUBJECT_REQUEST,
  UPDATE_CURRENT_SUBJECT_SUCCESS,
} from "../constants/subjectConstants";
import axios from "axios";
import isPublicMode from "../utils/isPublicMode";
import getTranscriptId from "../utils/getTranscriptId";

export const subjectsList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: LIST_SUBJECT_REQUEST,
    });

    let payload;

    if (isPublicMode()) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          transcriptId: getTranscriptId(),
        },
      };

      const { data } = await axios.get("/api/public/subjects", config);
      payload = data;
    } else {
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get("/api/subjects", config);
      payload = data;
    }
    dispatch({
      type: LIST_SUBJECT_SUCCESS,
      payload,
    });
  } catch (error) {
    dispatch({
      type: LIST_SUBJECT_FAIL,
      payload:
        error.responce && error.responsce.data.message
          ? error.message.data.message
          : error.message,
    });
  }
};

export const addSubject = (subject) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADD_SUBJECT_REQUEST,
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

    const { data } = await axios.post("/api/subjects", { subject }, config);

    await localStorage.setItem("subject", JSON.stringify(data.subject));

    dispatch({
      type: ADD_SUBJECT_SUCCESS,
      payload: data.subject,
    });
  } catch (error) {
    dispatch({
      type: ADD_SUBJECT_FAIL,
      payload:
        error.responce && error.responsce.data.message
          ? error.message.data.message
          : error.message,
    });
  }
};

export const updateCurrentSubject = (subject) => async (dispatch, getState) => {
  try {
    dispatch({
      type: UPDATE_CURRENT_SUBJECT_REQUEST,
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

    const { data } = await axios.put(
      `/api/subjects/update-current`,
      { subject },
      config
    );

    let userInfoTemp = JSON.parse(localStorage.getItem("userInfo"));
    userInfoTemp.currentSubject = subject;
    localStorage.setItem("userInfo", JSON.stringify(userInfoTemp));

    dispatch({
      type: UPDATE_CURRENT_SUBJECT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CURRENT_SUBJECT_FAIL,
      payload:
        error.responce && error.responsce.data.message
          ? error.message.data.message
          : error.message,
    });
  }
};
