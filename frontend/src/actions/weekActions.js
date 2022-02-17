import axios from "axios";
import {
  DAYS_OF_WEEK_REQUEST,
  DAYS_OF_WEEK_SUCCESS,
  DAYS_OF_WEEK_FAIL,
} from "../constants/weekConstants";
import getTranscriptId from "../utils/getTranscriptId";
import isPublicMode from "../utils/isPublicMode";

export const listDaysOfWeek = (weekNumber) => async (dispatch, getState) => {
  try {
    dispatch({ type: DAYS_OF_WEEK_REQUEST });

    let payload;

    if (isPublicMode()) {
      const config = {
        headers: {
          transcriptId: getTranscriptId(),
          Number: weekNumber,
        },
      };

      const { data } = await axios.get("/api/public/weeks/listDays", config);
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
          Number: weekNumber,
        },
      };

      const { data } = await axios.get("/api/dashboard/weeks/listDays", config);
      payload = data;
    }

    dispatch({
      type: DAYS_OF_WEEK_SUCCESS,
      payload,
    });
  } catch (err) {
    dispatch({
      type: DAYS_OF_WEEK_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};
