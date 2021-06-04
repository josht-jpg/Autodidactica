import {
  GET_HIDDEN_MATERIALS_FAIL,
  GET_HIDDEN_MATERIALS_REQUEST,
  GET_HIDDEN_MATERIALS_SUCCESS,
  GET_PUBLIC_TRANSCRIPT_FAIL,
  GET_PUBLIC_TRANSCRIPT_REQUEST,
  GET_PUBLIC_TRANSCRIPT_SUCCESS,
  GET_TRANSCRIPT_FAIL,
  GET_TRANSCRIPT_REQUEST,
  GET_TRANSCRIPT_SUCCESS,
} from "../constants/transcriptConstants";

export const transcriptDataReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_TRANSCRIPT_REQUEST:
      return { loading: true };
    case GET_TRANSCRIPT_SUCCESS:
      return { loading: false, transcript: action.payload };
    case GET_TRANSCRIPT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const hiddenMaterialsDataReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_HIDDEN_MATERIALS_REQUEST:
      return { hiddenMaterialsLoading: true };
    case GET_HIDDEN_MATERIALS_SUCCESS:
      return { hiddenMaterialsLoading: false, hiddenMaterials: action.payload };
    case GET_HIDDEN_MATERIALS_FAIL:
      return { hiddenMaterialsLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const publicTranscriptDataReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_PUBLIC_TRANSCRIPT_REQUEST:
      return { loading: true };
    case GET_PUBLIC_TRANSCRIPT_SUCCESS:
      return { loading: false, transcript: action.payload };
    case GET_PUBLIC_TRANSCRIPT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
