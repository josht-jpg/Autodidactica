import axios from "axios";
import {
  ADD_EXERCISE_FAIL,
  ADD_EXERCISE_REQUEST,
  ADD_EXERCISE_SUCCESS,
  EDIT_EXERCISE_TEXT_DATA_FAIL,
  EDIT_EXERCISE_TEXT_DATA_REQUEST,
  EDIT_EXERCISE_TEXT_DATA_SUCCESS,
  EXERCISE_LIST_FAIL,
  EXERCISE_LIST_REQUEST,
  EXERCISE_LIST_SUCCESS,
} from "../constants/exerciseConstants";
import isPublicMode from "../utils/isPublicMode";

export const listExercises = () => async (dispatch, getState) => {
  try {
    dispatch({ type: EXERCISE_LIST_REQUEST });

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

    const { data } = await axios.get("/api/exercises", config);

    dispatch({
      type: EXERCISE_LIST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: EXERCISE_LIST_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const addExercise =
  (title, description, _id) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: ADD_EXERCISE_REQUEST,
        });

        const {
          userLogin: { userInfo },
          addSubject: { subjectInfo },
        } = getState();

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
            Subject: subjectInfo._id,
          },
        };

        const { data } = await axios.post(
          "/api/exercises",
          {
            title,
            description,
            _id,
          },
          config
        );

        dispatch({
          type: ADD_EXERCISE_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: ADD_EXERCISE_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const editExerciseTextData =
  (title, description, id) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({ type: EDIT_EXERCISE_TEXT_DATA_REQUEST });

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

        const { data } = await axios.put(
          "/api/exercises/text",
          { title, description, id },
          config
        );

        dispatch({
          type: EDIT_EXERCISE_TEXT_DATA_SUCCESS,
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: EDIT_EXERCISE_TEXT_DATA_FAIL,
          payload:
            err.responce && err.message.data.message
              ? err.response.data.message
              : err.message,
        });
      }
    }
  };
