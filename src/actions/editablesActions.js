import axios from "axios";
import sanitizeLink from "../utils/sanitizeLink";
import {
  EDIT_CAPTION_FAIL,
  EDIT_CAPTION_REQUEST,
  EDIT_CAPTION_SUCCESS,
  EDIT_TEXT_FAIL,
  EDIT_TEXT_REQUEST,
  EDIT_TEXT_SUCCESS,
  INSERT_DIVIDER_FAIL,
  INSERT_DIVIDER_REQUEST,
  INSERT_DIVIDER_SUCCESS,
  INSERT_IMAGE_FAIL,
  INSERT_IMAGE_REQUEST,
  INSERT_IMAGE_SUCCESS,
  INSERT_LINK_FAIL,
  INSERT_LINK_REQUEST,
  INSERT_LINK_SUCCESS,
  INSERT_TEXT_FAIL,
  INSERT_TEXT_REQUEST,
  INSERT_TEXT_SUCCESS,
  INSERT_VIDEO_FAIL,
  INSERT_VIDEO_REQUEST,
  INSERT_VIDEO_SUCCESS,
  REMOVE_ELEMENT_FAIL,
  REMOVE_ELEMENT_REQUEST,
  REMOVE_ELEMENT_SUCCESS,
} from "../constants/editablesConstants";
import isPublicMode from "../utils/isPublicMode";

export const insertText =
  (index, materialId, elementId, type) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: INSERT_TEXT_REQUEST,
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
          `/api/${type}/insert/text`,
          { index, materialId, elementId },
          config
        );

        dispatch({
          type: INSERT_TEXT_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: INSERT_TEXT_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const insertImage =
  (index, url, file, materialId, elementId, type) =>
  async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: INSERT_IMAGE_REQUEST,
        });

        url = sanitizeLink(url);

        const {
          userLogin: { userInfo },
          addSubject: { subjectInfo },
        } = getState();

        let payload;

        if (file) {
          let formData = new FormData();
          formData.append("file", file);

          const config = {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userInfo.token}`,
              Subject: subjectInfo._id,
              index,
              materialId,
              elementId,
            },
          };

          const { data } = await axios.post(
            `/api/${type}/insert/image/upload`,
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
            `/api/${type}/insert/image/embed`,
            { index, url, materialId, elementId, type },
            config
          );

          payload = data;
        }

        dispatch({
          type: INSERT_IMAGE_SUCCESS,
          payload,
        });
      } catch (error) {
        dispatch({
          type: INSERT_IMAGE_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const insertVideo =
  (index, url, materialId, elementId, type) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: INSERT_VIDEO_REQUEST,
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

        url = sanitizeLink(url);

        const { data } = await axios.post(
          `/api/${type}/insert/video`,
          { index, url, materialId, elementId },
          config
        );

        dispatch({
          type: INSERT_VIDEO_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: INSERT_VIDEO_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const insertLink =
  (index, title, url, materialId, elementId, type) =>
  async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: INSERT_LINK_REQUEST,
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

        url = sanitizeLink(url);

        const { data } = await axios.post(
          `/api/${type}/insert/link`,
          { index, title, url, materialId, elementId },
          config
        );

        dispatch({
          type: INSERT_LINK_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: INSERT_LINK_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const insertDivider =
  (index, materialId, elementId, type) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: INSERT_DIVIDER_REQUEST,
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
          `/api/${type}/insert/divider`,
          { index, materialId, elementId },
          config
        );

        dispatch({
          type: INSERT_DIVIDER_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: INSERT_DIVIDER_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const editText =
  (text, elementId, materialId, type) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: EDIT_TEXT_REQUEST,
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
          `/api/${type}/edit/text`,
          { text, elementId, materialId },
          config
        );

        dispatch({
          type: EDIT_TEXT_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: EDIT_TEXT_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const editCaption =
  (caption, elementId, materialId, type) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: EDIT_CAPTION_REQUEST,
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
          `/api/${type}/edit/caption`,
          { caption, elementId, materialId },
          config
        );

        dispatch({
          type: EDIT_CAPTION_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: EDIT_CAPTION_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const removeElement =
  (elementId, materialId, type) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: REMOVE_ELEMENT_REQUEST,
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
            ElementId: elementId,
            MaterialId: materialId,
          },
        };

        const { data } = await axios.delete(
          `/api/${type}/remove/element`,
          config
        );

        dispatch({
          type: REMOVE_ELEMENT_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: REMOVE_ELEMENT_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };
