import axios from "axios";
import {
  WEEKS_OF_MONTH_REQUEST,
  WEEKS_OF_MONTH_SUCCESS,
  WEEKS_OF_MONTH_FAIL,
} from "../constants/monthConstants";
import getTranscriptId from "../utils/getTranscriptId";
import isPublicMode from "../utils/isPublicMode";

export const listWeeksOfMonth = (monthNumber) => async (dispatch, getState) => {
  try {
    dispatch({ type: WEEKS_OF_MONTH_REQUEST });

    let payload;

    if (isPublicMode()) {
      const config = {
        headers: {
          transcriptId: getTranscriptId(),
          Number: monthNumber,
        },
      };

      const { data } = await axios.get("/api/public/months/listWeeks", config);
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
          Number: monthNumber,
        },
      };

      const { data } = await axios.get(
        "/api/dashboard/months/listWeeks",
        config
      );
      payload = data;
    }
    dispatch({
      type: WEEKS_OF_MONTH_SUCCESS,
      payload,
    });
  } catch (err) {
    dispatch({
      type: WEEKS_OF_MONTH_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};
