import axios from "axios";
import {
  ADD_PROJECT_FAIL,
  ADD_PROJECT_REQUEST,
  ADD_PROJECT_SUCCESS,
  EDIT_PROJECT_DESCRIPTION_FAIL,
  EDIT_PROJECT_DESCRIPTION_REQUEST,
  EDIT_PROJECT_DESCRIPTION_SUCCESS,
  EDIT_PROJECT_TITLE_FAIL,
  EDIT_PROJECT_TITLE_REQUEST,
  EDIT_PROJECT_TITLE_SUCCESS,
  GET_PROJECT_DATA_FAIL,
  GET_PROJECT_DATA_REQUEST,
  GET_PROJECT_DATA_SUCCESS,
  PROJECT_LIST_FAIL,
  PROJECT_LIST_REQUEST,
  PROJECT_LIST_SUCCESS,
  REMOVE_PROJECT_FAIL,
  REMOVE_PROJECT_REQUEST,
  REMOVE_PROJECT_SUCCESS,
} from "../constants/projectConstants";
import getTranscriptId from "../utils/getTranscriptId";
import isPublicMode from "../utils/isPublicMode";

export const listProjects = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PROJECT_LIST_REQUEST });

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

    const { data } = await axios.get("/api/projects", config);

    dispatch({
      type: PROJECT_LIST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_LIST_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const addProject =
  (title, description, imageSrc, file, _id) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ADD_PROJECT_REQUEST,
      });

      const {
        userLogin: { userInfo },
        addSubject: { subjectInfo },
      } = getState();

      let payload;
      if (file) {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("id", _id);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.token}`,
            Subject: subjectInfo._id,
          },
        };

        const { data } = await axios.post(
          "/api/projects/withFile",
          formData,
          config
        );
        payload = data;
      } else {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
            Subject: subjectInfo._id,
          },
        };

        const { data } = await axios.post(
          "/api/projects",
          {
            title,
            description,
            imageSrc,
            _id,
          },
          config
        );

        payload = data;
      }

      dispatch({
        type: ADD_PROJECT_SUCCESS,
        payload,
      });
    } catch (error) {
      dispatch({
        type: ADD_PROJECT_FAIL,
        payload:
          error.responce && error.responsce.data.message
            ? error.message.data.message
            : error.message,
      });
    }
  };

export const getProjectData = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_PROJECT_DATA_REQUEST });

    let payload;
    if (isPublicMode()) {
      const config = {
        headers: {
          transcriptid: getTranscriptId(),
          Project: id,
        },
      };

      const { data } = await axios.get("/api/public/projects/data", config);
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
          Project: id,
        },
      };

      const { data } = await axios.get("/api/projects/data", config);
      payload = data;
    }
    dispatch({
      type: GET_PROJECT_DATA_SUCCESS,
      payload,
    });
  } catch (err) {
    dispatch({
      type: GET_PROJECT_DATA_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const editProjectTitle = (title, id) => async (dispatch, getState) => {
  if (!isPublicMode()) {
    try {
      dispatch({ type: EDIT_PROJECT_TITLE_REQUEST });

      const {
        userLogin: { userInfo },
        addSubject: { subjectInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          Subject: subjectInfo._id,
          Project: id,
        },
      };

      const { data } = await axios.put(
        "/api/projects/edit/title",
        { title, id },
        config
      );

      dispatch({
        type: EDIT_PROJECT_TITLE_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: EDIT_PROJECT_TITLE_FAIL,
        payload:
          err.responce && err.message.data.message
            ? err.response.data.message
            : err.message,
      });
    }
  }
};

export const editProjectDescription =
  (description, id) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({ type: EDIT_PROJECT_DESCRIPTION_REQUEST });

        const {
          userLogin: { userInfo },
          addSubject: { subjectInfo },
        } = getState();

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            Subject: subjectInfo._id,
            Project: id,
          },
        };

        const { data } = await axios.put(
          "/api/projects/edit/description",
          { description, id },
          config
        );

        dispatch({
          type: EDIT_PROJECT_DESCRIPTION_SUCCESS,
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: EDIT_PROJECT_DESCRIPTION_FAIL,
          payload:
            err.responce && err.message.data.message
              ? err.response.data.message
              : err.message,
        });
      }
    }
  };

export const removeProject = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: REMOVE_PROJECT_REQUEST });

    const {
      userLogin: { userInfo },
      addSubject: { subjectInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        Subject: subjectInfo._id,
        Project: id,
      },
    };

    const { data } = await axios.delete("/api/projects/", config);

    dispatch({
      type: REMOVE_PROJECT_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: REMOVE_PROJECT_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};
