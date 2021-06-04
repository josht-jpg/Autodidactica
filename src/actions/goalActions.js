import axios from "axios";
import {
  ADD_GOAL_FAIL,
  ADD_GOAL_REQUEST,
  ADD_GOAL_SUCCESS,
  GOAL_LIST_FAIL,
  GOAL_LIST_REQUEST,
  GOAL_LIST_SUCCESS,
  CHANGE_STATUS_REQUEST,
  CHANGE_STATUS_SUCCESS,
  CHANGE_STATUS_FAIL,
  REMOVE_GOAL_FAIL,
  REMOVE_GOAL_SUCCESS,
  REMOVE_GOAL_REQUEST,
  EDIT_PLAN_REQUEST,
  EDIT_PLAN_SUCCESS,
  EDIT_PLAN_FAIL,
  GET_ADD_GOAL_SCREEN_DATA_REQUEST,
  GET_ADD_GOAL_SCREEN_DATA_SUCCESS,
  GET_ADD_GOAL_SCREEN_DATA_FAIL,
} from "../constants/goalConstants";
import isPublicMode from "../utils/isPublicMode";

export const listGoals = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GOAL_LIST_REQUEST });

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

    const { data } = await axios.get("/api/goals", config);

    dispatch({
      type: GOAL_LIST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GOAL_LIST_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const addGoal =
  (
    plan,
    projects,
    resources,
    exercises,
    subgoals,
    day,
    week,
    month,
    quarter,
    _id
  ) =>
  async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: ADD_GOAL_REQUEST,
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
          "/api/goals",
          {
            plan,
            resources,
            exercises,
            projects,
            subgoals,
            day,
            week,
            month,
            quarter,
            _id,
          },
          config
        );

        dispatch({
          type: ADD_GOAL_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: ADD_GOAL_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const changeStatus =
  (identifier, status) => async (dispatch, getState) => {
    if (!isPublicMode()) {
      try {
        dispatch({
          type: CHANGE_STATUS_REQUEST,
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
          "/api/goals/status",
          {
            identifier,
            status,
          },
          config
        );

        dispatch({
          type: CHANGE_STATUS_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: CHANGE_STATUS_FAIL,
          payload:
            error.responce && error.responsce.data.message
              ? error.message.data.message
              : error.message,
        });
      }
    }
  };

export const editPlan = (plan, id) => async (dispatch, getState) => {
  if (!isPublicMode()) {
    try {
      dispatch({ type: EDIT_PLAN_REQUEST });

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

      const { data } = await axios.put("/api/goals/plan", { plan, id }, config);

      dispatch({
        type: EDIT_PLAN_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: EDIT_PLAN_FAIL,
        payload:
          err.responce && err.message.data.message
            ? err.response.data.message
            : err.message,
      });
    }
  }
};

export const removeGoal = (id) => async (dispatch, getState) => {
  if (!isPublicMode()) {
    try {
      dispatch({ type: REMOVE_GOAL_REQUEST });

      const {
        userLogin: { userInfo },
        addSubject: { subjectInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          Subject: subjectInfo._id,
          Goal: id,
        },
      };

      const { data } = await axios.delete("/api/goals", config);

      dispatch({
        type: REMOVE_GOAL_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: REMOVE_GOAL_FAIL,
        payload:
          err.responce && err.message.data.message
            ? err.response.data.message
            : err.message,
      });
    }
  }
};

export const getAddGoalScreenData = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ADD_GOAL_SCREEN_DATA_REQUEST });

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

    const { data } = await axios.get("/api/goals/add/screen", config);

    dispatch({
      type: GET_ADD_GOAL_SCREEN_DATA_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_ADD_GOAL_SCREEN_DATA_FAIL,
      payload:
        err.responce && err.message.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};
