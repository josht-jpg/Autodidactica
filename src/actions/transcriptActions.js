import axios from "axios";
import {
  GET_TRANSCRIPT_FAIL,
  GET_TRANSCRIPT_REQUEST,
  GET_TRANSCRIPT_SUCCESS,
  EXPOSE_MATERIAL_REQUEST,
  EXPOSE_MATERIAL_SUCCESS,
  EXPOSE_MATERIAL_FAIL,
  HIDE_MATERIAL_REQUEST,
  HIDE_MATERIAL_SUCCESS,
  HIDE_MATERIAL_FAIL,
  REARRANGE_MATERIALS_REQUEST,
  REARRANGE_MATERIALS_SUCCESS,
  REARRANGE_MATERIALS_FAIL,
  GET_HIDDEN_MATERIALS_REQUEST,
  GET_HIDDEN_MATERIALS_SUCCESS,
  GET_HIDDEN_MATERIALS_FAIL,
  MAKE_TRANSCRIPT_PUBLIC_FAIL,
  MAKE_TRANSCRIPT_PUBLIC_REQUEST,
  MAKE_TRANSCRIPT_PUBLIC_SUCCESS,
  MAKE_TRANSCRIPT_PRIVATE_FAIL,
  MAKE_TRANSCRIPT_PRIVATE_REQUEST,
  MAKE_TRANSCRIPT_PRIVATE_SUCCESS,
  GET_PUBLIC_TRANSCRIPT_REQUEST,
  GET_PUBLIC_TRANSCRIPT_SUCCESS,
  GET_PUBLIC_TRANSCRIPT_FAIL,
} from "../constants/transcriptConstants";

export const getTranscript = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_TRANSCRIPT_REQUEST,
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

    const { data } = await axios.get(`/api/transcript`, config);

    dispatch({
      type: GET_TRANSCRIPT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_TRANSCRIPT_FAIL,
      payload:
        error.responce && error.responsce.data.message
          ? error.message.data.message
          : error.message,
    });
  }
};

export const exposeMaterialOnServer =
  (dragIndex, materialType) => async (dispatch, getState) => {
    try {
      dispatch({
        type: EXPOSE_MATERIAL_REQUEST,
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
        `/api/transcript/expose/${materialType}`,
        { dragIndex },
        config
      );

      dispatch({
        type: EXPOSE_MATERIAL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: EXPOSE_MATERIAL_FAIL,
        payload:
          error.responce && error.responsce.data.message
            ? error.message.data.message
            : error.message,
      });
    }
  };

export const hideMaterialOnServer =
  (index, materialType) => async (dispatch, getState) => {
    try {
      dispatch({
        type: HIDE_MATERIAL_REQUEST,
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
        `/api/transcript/hidden/${materialType}`,
        { index },
        config
      );

      dispatch({
        type: HIDE_MATERIAL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: HIDE_MATERIAL_FAIL,
        payload:
          error.responce && error.responsce.data.message
            ? error.message.data.message
            : error.message,
      });
    }
  };

export const rearrangeMaterials =
  (draggingIndex, newIndex, materialType) => async (dispatch, getState) => {
    try {
      dispatch({
        type: REARRANGE_MATERIALS_REQUEST,
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
        `/api/transcript/rearrange/${materialType}s`,
        { draggingIndex, newIndex },
        config
      );

      dispatch({
        type: REARRANGE_MATERIALS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: REARRANGE_MATERIALS_FAIL,
        payload:
          error.responce && error.responsce.data.message
            ? error.message.data.message
            : error.message,
      });
    }
  };

export const getHiddenMaterials =
  (materialsType) => async (dispatch, getState) => {
    try {
      dispatch({
        type: GET_HIDDEN_MATERIALS_REQUEST,
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

      const { data } = await axios.get(
        `/api/transcript/hidden/${materialsType}`,
        config
      );

      dispatch({
        type: GET_HIDDEN_MATERIALS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_HIDDEN_MATERIALS_FAIL,
        payload:
          error.responce && error.responsce.data.message
            ? error.message.data.message
            : error.message,
      });
    }
  };

export const makePublic = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: MAKE_TRANSCRIPT_PUBLIC_REQUEST,
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
      `/api/transcript/public`,
      { value: true },
      config
    );

    dispatch({
      type: MAKE_TRANSCRIPT_PUBLIC_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MAKE_TRANSCRIPT_PUBLIC_FAIL,
      payload:
        error.responce && error.responsce.data.message
          ? error.message.data.message
          : error.message,
    });
  }
};

export const makePrivate = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: MAKE_TRANSCRIPT_PRIVATE_REQUEST,
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
      `/api/transcript/private`,
      { value: false },
      config
    );

    dispatch({
      type: MAKE_TRANSCRIPT_PRIVATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MAKE_TRANSCRIPT_PRIVATE_FAIL,
      payload:
        error.responce && error.responsce.data.message
          ? error.message.data.message
          : error.message,
    });
  }
};

export const getPublicTranscript = (transcriptId) => async (dispatch) => {
  try {
    dispatch({
      type: GET_PUBLIC_TRANSCRIPT_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        transcriptId,
      },
    };

    const { data } = await axios.get(`/api/transcript/public`, config);

    dispatch({
      type: GET_PUBLIC_TRANSCRIPT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_PUBLIC_TRANSCRIPT_FAIL,
      payload:
        error.responce && error.responsce.data.message
          ? error.message.data.message
          : error.message,
    });
  }
};
