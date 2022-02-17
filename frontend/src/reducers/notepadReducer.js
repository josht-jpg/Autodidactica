import {
  ADD_NOTE_PAD_FAIL,
  ADD_NOTE_PAD_REQUEST,
  ADD_NOTE_PAD_SUCCESS,
  NOTE_PAD_LIST_FAIL,
  NOTE_PAD_LIST_REQUEST,
  NOTE_PAD_LIST_SUCCESS,
  UPDATE_NOTE_PAD_REQUEST,
  UPDATE_NOTE_PAD_SUCCESS,
  UPDATE_NOTE_PAD_FAIL,
  ADD_TIMELINE_NOTE_PAD_REQUEST,
  ADD_TIMELINE_NOTE_PAD_SUCCESS,
  ADD_TIMELINE_NOTE_PAD_FAIL,
  NOTE_PAD_REQUEST,
  NOTE_PAD_SUCCESS,
  NOTE_PAD_FAIL,
  REMOVE_NOTEPAD_REQUEST,
  REMOVE_NOTEPAD_SUCCESS,
  REMOVE_NOTEPAD_FAIL,
} from "../constants/notepadConstants";

export const notesListReducer = (state = { notes: [] }, action) => {
  switch (action.type) {
    case NOTE_PAD_LIST_REQUEST:
      return { loading: true, notes: [] };
    case NOTE_PAD_LIST_SUCCESS:
      return { loading: false, notes: action.payload };
    case NOTE_PAD_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const notesByIdReducer = (state = { note: {} }, action) => {
  switch (action.type) {
    case NOTE_PAD_REQUEST:
      return { loading: true, note: {} };
    case NOTE_PAD_SUCCESS:
      return { loading: false, note: action.payload };
    case NOTE_PAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addNotepadReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_NOTE_PAD_REQUEST:
      return { loading: true };
    case ADD_NOTE_PAD_SUCCESS:
      return { loading: false, notes: action.payload };
    case ADD_NOTE_PAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addTimelineNotepadReducer = (
  state = { newNotepad: {} },
  action
) => {
  switch (action.type) {
    case ADD_TIMELINE_NOTE_PAD_REQUEST:
      return { loading: true };
    case ADD_TIMELINE_NOTE_PAD_SUCCESS:
      return { loading: false, newNotepad: action.payload };
    case ADD_TIMELINE_NOTE_PAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const updateNotepadReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_NOTE_PAD_REQUEST:
      return { loading: true };
    case UPDATE_NOTE_PAD_SUCCESS:
      return { loading: false, notes: action.payload };
    case UPDATE_NOTE_PAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const removeNotepadReducer = (state = {}, action) => {
  switch (action.type) {
    case REMOVE_NOTEPAD_REQUEST:
      return { loading: true };
    case REMOVE_NOTEPAD_SUCCESS:
      return { loading: false, notepadInfo: action.payload };
    case REMOVE_NOTEPAD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
