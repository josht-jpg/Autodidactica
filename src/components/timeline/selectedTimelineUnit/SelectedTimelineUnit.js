import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findNoteById } from "../../../actions/notepadActions";
import { listDaysOfWeek } from "../../../actions/weekActions";
import { listWeeksOfMonth } from "../../../actions/monthActions";
import { listMonthsOfQuarter } from "../../../actions/quarterActions";
import AddGoalsScreen from "../../screens/addScreens/addGoalScreen/AddGoalsScreen";
import AddElement from "../../editables//addElement/AddElement";
import SelectedGoal from "../../selectedGoal/SelectedGoal";
import Options from "../../options/Options";
import Loader from "../../Loader";
import CoreEditables from "../../editables/CoreEditables";
import TimelineTitle from "./timelineTitle/TimelineTitle";
import DropDown from "../../dropDown/DropDown";
import BackButton from "../../backButton/BackButton";
import OptionsButton from "../../optionsButton/OptionsButton";
import setIsPreview from "../../../utils/setIsPreview";
import styles from "./SelectedTimelineUnit.module.scss";
import SelectedMaterial from "../../selectedMaterial/SelectedMaterial";
import { editTitle, getUnitData } from "../../../actions/timelineActions";
import replaceArrayElement from "../../../utils/replaceArrayElement";

const sortTimeline = (a, b) => {
  return a.number > b.number ? 1 : b.number > a.number ? -1 : 0;
};

const SelectedTimelineUnit = ({
  unit,
  type,
  handleClose,
  selectedItemWidth,
}) => {
  const { isPreview, hideEditMode } = setIsPreview();

  const notesById = useSelector((state) => state.notesById);
  let note = notesById.note;

  const unitData = useSelector((state) => state.unitData);

  const [unitState, setUnitState] = useState(unit);

  const [editableElementsState, setEditableElementsState] = useState(
    unit && unit.editableElements
  );

  const handleAddElement = (newElement, index) => {
    const result = [
      ...editableElementsState.slice(0, index),
      newElement,
      ...editableElementsState.slice(index),
    ];
    setEditableElementsState(result);
    unit.editableElements = result;
  };
  const handleUpdateElement = (element, index) => {
    const result = replaceArrayElement(editableElementsState, element, index);
    unit.editableElements = result;
  };
  const removeElementFromState = (index) => {
    let result = [...editableElementsState];
    result.splice(index, 1);
    unit.editableElements = result;
    setEditableElementsState(result);
  };

  const daysOfWeek = useSelector((state) => state.daysOfWeek);
  const { days } = daysOfWeek;
  const weeksOfMonth = useSelector((state) => state.weeksOfMonth);
  const { weeks } = weeksOfMonth;
  const monthsOfQuarter = useSelector((state) => state.monthsOfQuarter);
  const { months } = monthsOfQuarter;

  const subunits =
    type === "Quarter"
      ? months && months.sort(sortTimeline)
      : type === "Month"
      ? weeks && weeks.sort(sortTimeline)
      : type === "Week" && days && days.sort(sortTimeline);

  const innerTimeline =
    type === "Week"
      ? "days"
      : type === "Month"
      ? "weeks"
      : type === "Quarter" && "months";

  const [isEditMode, setIsEditMode] = useState(!hideEditMode);
  const [isEditArray, setIsEditArray] = useState([]);
  const [isImageArray, setIsImageArray] = useState([]);
  const [isHoverArray, setIsHoverArray] = useState([]);

  const dispatch = useDispatch();

  const editableElementsSetup = (editableElements) => {
    setEditableElementsState(editableElements);
    const falseArray = Array(editableElements && editableElements.length).fill(
      false
    );

    setIsEditArray(falseArray);
    setIsImageArray(falseArray);
    setIsHoverArray(falseArray);
  };

  const getInnerTimeline = useCallback(() => {
    if (type === "Week") {
      dispatch(listDaysOfWeek(unit.number));
    } else if (type === "Month") {
      dispatch(listWeeksOfMonth(unit.number));
    } else if (type === "Quarter") {
      dispatch(listMonthsOfQuarter(unit.number));
    }
  }, [dispatch, type, unit.number]);

  const changeDefaultEditMode = useCallback(
    () => !hideEditMode && sessionStorage.setItem("hideEditMode", true),
    [hideEditMode]
  );

  window.addEventListener("beforeunload", () =>
    dispatch(editTitle(unit.title, type, unit.number))
  );

  useEffect(() => {
    const setUpUnitData = () => {
      if (unit.isMissingData) {
        dispatch(getUnitData(type, unit.number));
      } else {
        unit.notepad && dispatch(findNoteById(unit.notepad));
        editableElementsSetup(unit.editableElements);
      }
      getInnerTimeline();
    };

    unit && setUpUnitData();
    changeDefaultEditMode();

    return () => dispatch(editTitle(unit.title, type, unit.number));
  }, [dispatch, getInnerTimeline, type, unit, changeDefaultEditMode]);

  const handleUnitDataResponse = () => {
    if (unit && unit.isMissingData) {
      note = unitData.unit && unitData.unit.notepad;
      editableElementsSetup(unitData.unit && unitData.unit.editableElements);
      setUnitState(unitData.unit);
    }
  };

  useEffect(() => {
    handleUnitDataResponse();
  }, [unitData, handleUnitDataResponse]);

  const [selectedGoal, setSelectedGoal] = useState(false);

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
  };

  const [isAddGoalScreen, setIsAddGoalScreen] = useState(false);

  const handleCloseAddScreen = () => {
    setSelectedGoal(false);
    setIsAddGoalScreen(false);
  };

  const handleAddGoal = (
    plan,
    goalProjects,
    goalBooks,
    goalExercises,
    subgoals,
    _id,
    editableElements
  ) => {
    window.location.reload();
    unitState.goals.push({
      plan,
      projects: goalProjects,
      resources: goalBooks,
      exercises: goalExercises,
      subgoals,
      _id,
      editableElements,
    });
  };

  const handleGoalClose = () => {
    setSelectedGoal(false);
  };

  const [selectedMaterial, setSelectedMaterial] = useState(false);
  const handleMaterialSelect = (material, materialType) => {
    material.type = materialType;
    setSelectedMaterial(material);
  };
  const handleMaterialClose = () => {
    setSelectedMaterial(false);
  };

  const [isOptionsSelected, setIsOptionsSelected] = useState(!hideEditMode);
  const handleOptionsSelect = () => {
    setIsOptionsSelected((prev) => !prev);
  };
  const handleOptionsClose = () => {
    setIsOptionsSelected(false);
  };

  const handleEditPreviewSwitch = () => {
    if (isEditMode) {
      setIsEditArray(new Array(isEditArray.length).fill(false));
    }
    setIsEditMode((prev) => !prev);
  };

  return (
    <>
      {isAddGoalScreen && (
        <AddGoalsScreen
          type={"book"}
          handleAddGoal={handleAddGoal}
          handleCloseAddScreen={handleCloseAddScreen}
          width={selectedItemWidth}
          timeline={{ type, number: unitState.number }}
        />
      )}

      {selectedGoal && (
        <SelectedGoal
          goal={selectedGoal}
          handleClose={handleGoalClose}
          goalWidth={selectedItemWidth}
        />
      )}

      {selectedMaterial && (
        <SelectedMaterial
          type={selectedMaterial.type}
          unit={selectedMaterial}
          handleUnselect={handleMaterialClose}
          dashboardWidth={selectedItemWidth}
        />
      )}

      <div
        className={styles.selectedTimelineUnit}
        style={{
          zIndex:
            selectedGoal || selectedMaterial || isAddGoalScreen ? "1" : "1051",
          width: selectedItemWidth,
        }}
      >
        {unitData.loading ? (
          <Loader style={{ textAlign: "center", marginTop: "35vh" }} />
        ) : (
          <>
            <BackButton action={handleClose} />
            <OptionsButton action={handleOptionsSelect} isPreview={isPreview} />

            {isOptionsSelected && (
              <Options
                type={`${type} ${unitState.number}`}
                isEditMode={isEditMode}
                eventHandlers={{ handleEditPreviewSwitch, handleOptionsClose }}
              />
            )}

            <div
              style={{
                height: isImageArray[0]
                  ? isImageArray[0]
                  : isEditArray[0]
                  ? "60px"
                  : isEditMode
                  ? "35px"
                  : "0px",
                transition: "375ms",
                marginTop: isEditMode && "40px",
                marginBottom: isEditMode && "40px",
              }}
            >
              {isEditMode && (
                <AddElement
                  handleAddElement={handleAddElement}
                  setIsEditArray={setIsEditArray}
                  setIsImageArray={setIsImageArray}
                  index={0}
                  materialId={unitState._id}
                  type={`dashboard/${type.toLowerCase()}s`}
                />
              )}
            </div>

            {editableElementsState &&
              editableElementsState.map((element, index) => {
                let isSkip = false;
                return (
                  <React.Fragment key={element._id}>
                    {element.type === "TITLE" ? (
                      unitState && (
                        <TimelineTitle
                          unit={(({
                            title,
                            number,
                            date,
                            previousDate,
                            nextDate,
                            _id,
                          }) => ({
                            title,
                            number,
                            date,
                            previousDate,
                            nextDate,
                            _id,
                          }))(unitState)}
                          type={type}
                          updateTimelineTitle={(title) => {
                            unit.title = title;
                          }}
                          updateDate={(date) => {
                            unit.date = date;
                          }}
                          isEditMode={isEditMode}
                        />
                      )
                    ) : element.type === "GOALS" ? (
                      <DropDown
                        items={{
                          goals:
                            unitState && unitState.goals ? unitState.goals : [],
                          goalsType: type,
                        }}
                        isAddSelected={isAddGoalScreen}
                        setIsAddSelected={setIsAddGoalScreen}
                        handleSelect={handleGoalSelect}
                        isPreview={isPreview}
                        addMargin={
                          editableElementsState[index + 1].type !==
                            "PROJECTS" &&
                          editableElementsState[index + 1].type !==
                            "RESOURCES" &&
                          editableElementsState[index + 1].type !==
                            "EXERCISES" &&
                          editableElementsState[index + 1].type !== "NOTES"
                        }
                      />
                    ) : element.type === "PROJECTS" ? (
                      unitState.projects && unitState.projects.length > 0 ? (
                        <DropDown
                          items={{
                            projects: unitState.projects,
                          }}
                          handleSelect={(project) =>
                            handleMaterialSelect(project, "project")
                          }
                          isPreview={isPreview}
                          addMargin={
                            editableElementsState[index + 1].type !==
                              "RESOURCES" &&
                            editableElementsState[index + 1].type !==
                              "EXERCISES" &&
                            editableElementsState[index + 1].type !== "NOTES"
                          }
                        />
                      ) : (
                        (isSkip = true)
                      )
                    ) : element.type === "RESOURCES" ? (
                      unitState.books && unitState.books.length > 0 ? (
                        <DropDown
                          items={{
                            books: unitState.books,
                          }}
                          handleSelect={(resource) =>
                            handleMaterialSelect(resource, "resource")
                          }
                          isPreview={isPreview}
                          addMargin={
                            editableElementsState[index + 1].type !==
                              "EXERCISES" &&
                            editableElementsState[index + 1].type !== "NOTES"
                          }
                        />
                      ) : (
                        (isSkip = true)
                      )
                    ) : element.type === "EXERCISES" ? (
                      unitState.exercises && unitState.exercises.length > 0 ? (
                        <DropDown
                          items={{
                            exercises: unitState.exercises,
                          }}
                          handleSelect={(exercise) =>
                            handleMaterialSelect(exercise, "exercise")
                          }
                          isPreview={isPreview}
                          addMargin={
                            editableElementsState[index + 1].type !== "NOTES"
                          }
                        />
                      ) : (
                        (isSkip = true)
                      )
                    ) : element.type === "NOTES" ? (
                      <DropDown
                        items={{
                          notepad: note,
                          unitType: type,
                          unitNumber: unitState && unitState.number,
                        }}
                        isPreview={isPreview}
                        addMargin={
                          editableElementsState[index + 1] &&
                          editableElementsState[index + 1].type !==
                            "INNER_TIMELINE"
                        }
                      />
                    ) : element.type === "INNER_TIMELINE" ? (
                      unitState[innerTimeline] &&
                      unitState[innerTimeline].length > 0 ? (
                        <DropDown
                          items={{
                            innerTimelineUnits: subunits,
                            timelineType: type,
                            selectedItemWidth,
                            innerTimeline: innerTimeline,
                            daysLength: unitState.days && unitState.days.length,
                          }}
                          isPreview={isPreview}
                          addMargin={true}
                        />
                      ) : (
                        (isSkip = true)
                      )
                    ) : (
                      <CoreEditables
                        element={{
                          ...element,
                          unit: {
                            ...unitState,
                            type: `dashboard/${type.toLowerCase()}s`,
                          },
                          index,
                        }}
                        isEditMode={isEditMode}
                        isHoverArrayState={{ isHoverArray, setIsHoverArray }}
                        editableElements={{
                          editableElementsState,
                          setEditableElementsState,
                          removeElementFromState,
                          handleUpdateElement,
                        }}
                      />
                    )}

                    {!isSkip && (
                      <div
                        style={{
                          height: isImageArray[index + 1]
                            ? isImageArray[index + 1]
                            : index < isEditArray.length &&
                              isEditArray[index + 1]
                            ? "60px"
                            : isEditMode
                            ? "35px"
                            : "0px",
                          transition: "375ms",
                          marginTop: isEditMode && "40px",
                          marginBottom: isEditMode && "40px",
                        }}
                      >
                        {isEditMode && (
                          <AddElement
                            handleAddElement={handleAddElement}
                            setIsEditArray={setIsEditArray}
                            setIsImageArray={setIsImageArray}
                            index={index + 1}
                            materialId={unitState._id}
                            type={`dashboard/${type.toLowerCase()}s`}
                          />
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
          </>
        )}
      </div>
    </>
  );
};

export default SelectedTimelineUnit;
