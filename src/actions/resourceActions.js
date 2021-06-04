import axios from "axios";
import {
  ADD_RESOURCE_FAIL,
  ADD_RESOURCE_REQUEST,
  ADD_RESOURCE_SUCCESS,
  BOOK_LIST_FAIL,
  BOOK_LIST_REQUEST,
  BOOK_LIST_SUCCESS,
  COURSE_LIST_FAIL,
  COURSE_LIST_REQUEST,
  COURSE_LIST_SUCCESS,
  EDIT_AUTHORS_FAIL,
  EDIT_AUTHORS_REQUEST,
  EDIT_AUTHORS_SUCCESS,
  EDIT_RESOURCE_TEXT_DATA_FAIL,
  EDIT_RESOURCE_TEXT_DATA_REQUEST,
  EDIT_RESOURCE_TEXT_DATA_SUCCESS,
  GET_RESOURCE_DATA_FAIL,
  GET_RESOURCE_DATA_REQUEST,
  GET_RESOURCE_DATA_SUCCESS,
  REMOVE_RESOURCE_FAIL,
  REMOVE_RESOURCE_REQUEST,
  REMOVE_RESOURCE_SUCCESS,
} from "../constants/resourceConstants";
import getTranscriptId from "../utils/getTranscriptId";
import isPublicMode from "../utils/isPublicMode";

export const listBooks = () => async (dispatch, getState) => {
  try {
    dispatch({ type: BOOK_LIST_REQUEST });

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

    const { data } = await axios.get("/api/resources/books", config);

    dispatch({
      type: BOOK_LIST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: BOOK_LIST_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const listCourses = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COURSE_LIST_REQUEST });

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

    const { data } = await axios.get("/api/resources/courses", config);

    dispatch({
      type: COURSE_LIST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: COURSE_LIST_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const addBook = (book) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADD_RESOURCE_REQUEST,
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
      "/api/resources/book",
      {
        book,
      },
      config
    );

    dispatch({
      type: ADD_RESOURCE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADD_RESOURCE_FAIL,
      payload:
        error.responce && error.responsce.data.message
          ? error.message.data.message
          : error.message,
    });
  }
};

export const getResourceData = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_RESOURCE_DATA_REQUEST });

    let payload;
    if (isPublicMode()) {
      const config = {
        headers: {
          transcriptId: getTranscriptId(),
          Resource: id,
        },
      };

      const { data } = await axios.get("/api/public/resources/data", config);
      payload = data;
    } else {
      const {
        userLogin: { userInfo },
        addSubject: { subjectInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          Subject: subjectInfo._id,
          Resource: id,
        },
      };

      const { data } = await axios.get("/api/resources/data", config);
      payload = data;
    }
    dispatch({
      type: GET_RESOURCE_DATA_SUCCESS,
      payload,
    });
  } catch (err) {
    dispatch({
      type: GET_RESOURCE_DATA_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const editResourceTextData =
  (data, type, id) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({ type: EDIT_RESOURCE_TEXT_DATA_REQUEST });

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

        const { returnData } = await axios.put(
          "/api/resources/text",
          { data, type, id },
          config
        );

        dispatch({
          type: EDIT_RESOURCE_TEXT_DATA_SUCCESS,
          payload: returnData,
        });
      } catch (err) {
        dispatch({
          type: EDIT_RESOURCE_TEXT_DATA_FAIL,
          payload:
            err.responce && err.message.data.message
              ? err.response.data.message
              : err.message,
        });
      }
    }
  };

export const editAuthors = (authors, id) => async (dispatch, getState) => {
  if (!isPublicMode()) {
    try {
      dispatch({ type: EDIT_AUTHORS_REQUEST });

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

      const { returnData } = await axios.put(
        "/api/resources/authors",
        { authors, id },
        config
      );

      dispatch({
        type: EDIT_AUTHORS_SUCCESS,
        payload: returnData,
      });
    } catch (err) {
      dispatch({
        type: EDIT_AUTHORS_FAIL,
        payload:
          err.responce && err.message.data.message
            ? err.response.data.message
            : err.message,
      });
    }
  }
};

export const removeResource = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: REMOVE_RESOURCE_REQUEST });

    const {
      userLogin: { userInfo },
      addSubject: { subjectInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        Subject: subjectInfo._id,
        Resource: id,
      },
    };

    const { data } = await axios.delete("/api/resources/", config);

    dispatch({
      type: REMOVE_RESOURCE_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: REMOVE_RESOURCE_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};
