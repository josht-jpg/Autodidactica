import axios from "axios";
import {
  ADD_NOTE_PAD_FAIL,
  ADD_NOTE_PAD_REQUEST,
  ADD_NOTE_PAD_SUCCESS,
  NOTE_PAD_LIST_FAIL,
  NOTE_PAD_LIST_REQUEST,
  NOTE_PAD_LIST_SUCCESS,
  UPDATE_NOTE_PAD_FAIL,
  UPDATE_NOTE_PAD_REQUEST,
  UPDATE_NOTE_PAD_SUCCESS,
  NOTE_PAD_REQUEST,
  NOTE_PAD_SUCCESS,
  NOTE_PAD_FAIL,
  REMOVE_NOTEPAD_REQUEST,
  REMOVE_NOTEPAD_SUCCESS,
  REMOVE_NOTEPAD_FAIL,
  EDIT_NOTEPAD_TITLE_FAIL,
  EDIT_NOTEPAD_TITLE_SUCCESS,
  EDIT_NOTEPAD_TITLE_REQUEST,
} from "../constants/notepadConstants";
import isPublicMode from "../utils/isPublicMode";

export const listNotes = () => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTE_PAD_LIST_REQUEST });

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

    const { data } = await axios.get("/api/notes", config);

    dispatch({
      type: NOTE_PAD_LIST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: NOTE_PAD_LIST_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const findNoteById = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTE_PAD_REQUEST });

    let payload;
    if (isPublicMode()) {
      const config = {
        headers: {
          id,
        },
      };

      const { data } = await axios.get("/api/public/notes/id", config);
      payload = data;
    } else {
      const {
        userLogin: { userInfo },
        addSubject: { subjectInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          id,
          Subject: subjectInfo._id,
        },
      };

      const { data } = await axios.get("/api/notes/id", config);
      payload = data;
    }

    dispatch({
      type: NOTE_PAD_SUCCESS,
      payload,
    });
  } catch (err) {
    dispatch({
      type: NOTE_PAD_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const addNotepad =
  (name, material, type) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: ADD_NOTE_PAD_REQUEST,
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
          "/api/notes",
          {
            name,
            material,
            type,
          },
          config
        );

        dispatch({
          type: ADD_NOTE_PAD_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: ADD_NOTE_PAD_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const updateNotepad =
  (content, notepadId) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: UPDATE_NOTE_PAD_REQUEST,
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

        const { data } = await axios.put(
          "/api/notes",
          {
            content,
            notepadId,
          },
          config
        );

        dispatch({
          type: UPDATE_NOTE_PAD_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: UPDATE_NOTE_PAD_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const editNotepadTitle = (title, id) => async (dispatch, getState) => {
  if (!isPublicMode()) {
    try {
      dispatch({ type: EDIT_NOTEPAD_TITLE_REQUEST });

      const {
        userLogin: { userInfo },
        addSubject: { subjectInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          Subject: subjectInfo._id,
          Notepad: id,
        },
      };

      const { data } = await axios.put(
        "/api/notes/edit/title",
        { title, id },
        config
      );

      dispatch({
        type: EDIT_NOTEPAD_TITLE_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: EDIT_NOTEPAD_TITLE_FAIL,
        payload:
          err.responce && err.message.data.message
            ? err.response.data.message
            : err.message,
      });
    }
  }
};

export const removeNotepad = (id) => async (dispatch, getState) => {
  if (!isPublicMode()) {
    try {
      dispatch({ type: REMOVE_NOTEPAD_REQUEST });

      const {
        userLogin: { userInfo },
        addSubject: { subjectInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          Subject: subjectInfo._id,
          Notepad: id,
        },
      };

      const { data } = await axios.delete("/api/notes", config);

      dispatch({
        type: REMOVE_NOTEPAD_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: REMOVE_NOTEPAD_FAIL,
        payload:
          err.responce && err.message.data.message
            ? err.response.data.message
            : err.message,
      });
    }
  }
};
