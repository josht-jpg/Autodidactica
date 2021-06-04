import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { monthsOfQuarterReducer } from "./reducers/quarterReducer";
import { weeksOfMonthReducer } from "./reducers/monthReducer";
import { daysOfWeekReducer } from "./reducers/weekReducer";
import {
  userLoginReducer,
  userInfoReducer,
  userRegisterReducer,
  googleRegisterReducer,
  googleAuthReducer,
} from "./reducers/userReducer";
import {
  addResourceReducer,
  bookListReducer,
  courseListReducer,
  resourceDataReducer,
  editResourceTextDataReducer,
} from "./reducers/resourceReducer";
import {
  goalListReducer,
  addGoalReducer,
  addGoalScreenDataReducer,
  updateStatusReducer,
} from "./reducers/goalReducer";
import {
  projectListReducer,
  addProjectReducer,
  projectDataReducer,
} from "./reducers/projectReducer";
import {
  notesListReducer,
  notesByIdReducer,
  addNotepadReducer,
  addTimelineNotepadReducer,
  updateNotepadReducer,
} from "./reducers/notepadReducer";
import {
  listSubjectsReducer,
  addSubjectReducer,
} from "./reducers/subjectReducer";
import {
  exerciseListReducer,
  addExerciseReducer,
  editExerciseTextDataReducer,
} from "./reducers/exerciseReducer";
import {
  unitDataReducer,
  timelineScreenReducer,
  addUnitReducer,
} from "./reducers/timelineReducer";
import {
  yearListReducer,
  addYearReducer,
  yearsWithQuartersReducer,
} from "./reducers/yearReducer";
import {
  transcriptDataReducer,
  hiddenMaterialsDataReducer,
  publicTranscriptDataReducer,
} from "./reducers/transcriptReducer";
import { removedItemsReducer } from "./reducers/trashReducer";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  googleAuth: googleAuthReducer,
  userRegister: userRegisterReducer,
  userInfo: userInfoReducer,
  googleRegister: googleRegisterReducer,
  bookList: bookListReducer,
  courseList: courseListReducer,
  addResource: addResourceReducer,
  goalList: goalListReducer,
  addGoal: addGoalReducer,
  projectList: projectListReducer,
  addProject: addProjectReducer,
  projectData: projectDataReducer,
  notesList: notesListReducer,
  addNotepad: addNotepadReducer,
  addTimelineNotepad: addTimelineNotepadReducer,
  updateNotepad: updateNotepadReducer,
  notesById: notesByIdReducer,
  addSubject: addSubjectReducer,
  listSubjects: listSubjectsReducer,
  updateStatus: updateStatusReducer,
  daysOfWeek: daysOfWeekReducer,
  weeksOfMonth: weeksOfMonthReducer,
  resourceData: resourceDataReducer,
  exerciseList: exerciseListReducer,
  addExercise: addExerciseReducer,
  monthsOfQuarter: monthsOfQuarterReducer,
  editResourceTextData: editResourceTextDataReducer,
  editExerciseTextData: editExerciseTextDataReducer,
  yearList: yearListReducer,
  addYear: addYearReducer,
  transcriptData: transcriptDataReducer,
  hiddenMaterialsData: hiddenMaterialsDataReducer,
  yearsWithQuarters: yearsWithQuartersReducer,
  removedItems: removedItemsReducer,
  unitData: unitDataReducer,
  addGoalScreenData: addGoalScreenDataReducer,
  timelineScreen: timelineScreenReducer,
  addUnit: addUnitReducer,
  publicTranscriptData: publicTranscriptDataReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const subjectInfoFromStorage = localStorage.getItem("subject")
  ? JSON.parse(localStorage.getItem("subject"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  addSubject: { subjectInfo: subjectInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
