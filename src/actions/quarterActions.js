import axios from "axios";
import {
  MONTHS_OF_QUARTER_REQUEST,
  MONTHS_OF_QUARTER_SUCCESS,
  MONTHS_OF_QUARTER_FAIL,
} from "../constants/quarterConstants";
import getTranscriptId from "../utils/getTranscriptId";
import isPublicMode from "../utils/isPublicMode";

export const listMonthsOfQuarter =
  (quarterNumber) => async (dispatch, getState) => {
    try {
      dispatch({ type: MONTHS_OF_QUARTER_REQUEST });

      let payload;

      if (isPublicMode()) {
        const config = {
          headers: {
            transcriptId: getTranscriptId(),
            Number: quarterNumber,
          },
        };

        const { data } = await axios.get(
          "/api/public/quarters/listMonths",
          config
        );
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
            Number: quarterNumber,
          },
        };

        const { data } = await axios.get(
          "/api/dashboard/quarters/listMonths",
          config
        );

        payload = data;
      }
      dispatch({
        type: MONTHS_OF_QUARTER_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: MONTHS_OF_QUARTER_FAIL,
        payload:
          err.responce && err.message.data.message
            ? err.response.data.message
            : err.message,
      });
    }
  };
