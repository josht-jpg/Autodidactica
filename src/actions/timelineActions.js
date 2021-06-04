import axios from "axios";
import {
  EDIT_DATE_FAIL,
  EDIT_DATE_REQUEST,
  EDIT_DATE_SUCCESS,
  GET_UNIT_DATA_FAIL,
  GET_UNIT_DATA_REQUEST,
  GET_UNIT_DATA_SUCCESS,
  ADD_UNIT_REQUEST,
  ADD_UNIT_SUCCESS,
  ADD_UNIT_FAIL,
  TIMELINE_DATA_SUCCESS,
  TIMELINE_DATA_REQUEST,
  TIMELINE_DATA_FAIL,
  EDIT_TITLE_REQUEST,
  EDIT_TITLE_SUCCESS,
  EDIT_TITLE_FAIL,
} from "../constants/timelineConstants";
import getTranscriptId from "../utils/getTranscriptId";
import isPublicMode from "../utils/isPublicMode";

export const getUnitData = (type, unitNumber) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_UNIT_DATA_REQUEST });

    let payload;
    if (isPublicMode()) {
      const config = {
        headers: {
          transcriptId: getTranscriptId(),
          unit_type: type,
          unit_number: unitNumber,
        },
      };

      const { data } = await axios.get("/api/public/dashboard/unit", config);
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
          unit_type: type,
          unit_number: unitNumber,
        },
      };

      const { data } = await axios.get("/api/dashboard/unit", config);
      payload = data;
    }

    dispatch({
      type: GET_UNIT_DATA_SUCCESS,
      payload,
    });
  } catch (err) {
    dispatch({
      type: GET_UNIT_DATA_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const editTitle =
  (title, type, unitNumber) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({ type: EDIT_TITLE_REQUEST });

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
          `/api/dashboard/${type.toLowerCase()}s/title`,
          { title, unitNumber },
          config
        );

        dispatch({
          type: EDIT_TITLE_SUCCESS,
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: EDIT_TITLE_FAIL,
          payload:
            err.responce && err.message.data.message
              ? err.response.data.message
              : err.message,
        });
      }
    }
  };

export const editDate =
  (date, type, unitNumber) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({ type: EDIT_DATE_REQUEST });

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
          `/api/dashboard/${type.toLowerCase()}s/date`,
          { date, unitNumber },
          config
        );

        dispatch({
          type: EDIT_DATE_SUCCESS,
          payload: returnData,
        });
      } catch (err) {
        dispatch({
          type: EDIT_DATE_FAIL,
          payload:
            err.responce && err.message.data.message
              ? err.response.data.message
              : err.message,
        });
      }
    }
  };

export const addUnit = (unit, unitType) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADD_UNIT_REQUEST,
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
      `/api/dashboard/${unitType}s`,
      { goals: unit.goals, title: unit.title, date: unit.date },
      config
    );

    dispatch({
      type: ADD_UNIT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADD_UNIT_FAIL,
      payload:
        error.responce && error.responsce.data.message
          ? error.message.data.message
          : error.message,
    });
  }
};

export const getTimelineData = (timelineType) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TIMELINE_DATA_REQUEST,
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
      `/api/dashboard/${timelineType}Screen`,
      config
    );

    dispatch({
      type: TIMELINE_DATA_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TIMELINE_DATA_FAIL,
      payload:
        error.responce && error.responsce.data.message
          ? error.message.data.message
          : error.message,
    });
  }
};
