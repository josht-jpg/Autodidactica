import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FaSignal } from "react-icons/fa";
import { removeGoal } from "../../actions/goalActions";
import AddElement from "../editables/addElement/AddElement";
import Options from "../options/Options";
import CoreEditables from "../editables/CoreEditables";
import BackButton from "../backButton/BackButton";
import OptionsButton from "../optionsButton/OptionsButton";
import Title from "./title/Title";
import GoalTimeline from "./goalTimeline/GoalTimeline";
import Materials from "./materials/Materials";
import Completion from "./completion/Completion";
import Subgoals from "./subgoals/Subgoals";
import styles from "./SelectedGoal.module.scss";
import SelectedMaterial from "../selectedMaterial/SelectedMaterial";
import SelectedTimelineUnit from "../timeline/selectedTimelineUnit/SelectedTimelineUnit";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import replaceArrayElement from "../../utils/replaceArrayElement";

const materialTypes = ["project", "resource", "exercise"];

const SelectedGoal = ({ goal, handleClose, goalWidth, recursiveCall }) => {
  const isPreview = JSON.parse(sessionStorage.getItem("isPreview"));
  const hideEditMode =
    isPreview || JSON.parse(sessionStorage.getItem("hideEditMode"));

  const dispatch = useDispatch();

  const [selectedTimeline, setSelectedTimeline] = useState(false);
  const handleTimelineSelect = (type, number) => {
    if (!isEditMode) {
      setSelectedTimeline({ type, number });
    }
  };

  const [selectedMaterial, setSelectedMaterial] = useState(false);
  const [selectedMaterialType, setSelectedMaterialType] = useState("");
  const handleMaterialSelect = (material, materialType) => {
    setSelectedMaterial(material);
    setSelectedMaterialType(materialType);
  };
  const handleMaterialUnselect = () => {
    setSelectedMaterial(false);
    setSelectedMaterialType("");
  };

  const [isEditMode, setIsEditMode] = useState(!hideEditMode);

  const [editableElementsState, setEditableElementsState] = useState([]);
  const handleAddElement = (newElement, index) => {
    const result = [
      ...editableElementsState.slice(0, index),
      newElement,
      ...editableElementsState.slice(index),
    ];
    setEditableElementsState(result);
    goal.editableElements = result;
  };
  const handleUpdateElement = (element, index) => {
    const result = replaceArrayElement(editableElementsState, element, index);
    goal.editableElements = result;
  };
  const removeElementFromState = (index) => {
    let result = [...editableElementsState];
    result.splice(index, 1);
    goal.editableElements = result;
    setEditableElementsState(result);
  };

  const [isEditArray, setIsEditArray] = useState([]);
  const [isImageArray, setIsImageArray] = useState([]);
  const [isHoverArray, setIsHoverArray] = useState([]);

  useEffect(() => {
    setEditableElementsState(goal.editableElements);
    const falseArray = Array(goal && goal.editableElements.length).fill(false);
    setIsEditArray(falseArray);
    setIsImageArray(falseArray);
    setIsHoverArray(falseArray);

    if (!hideEditMode) {
      sessionStorage.setItem("hideEditMode", true);
    }
  }, []);

  const handleUnselectTimeline = () => {
    setSelectedTimeline(false);
  };

  const [selectedSubgoal, setSelectedSubgoal] = useState(false);
  const handleSubgoalClose = () => {
    setSelectedSubgoal(false);
  };
  const handleSubgoalSelect = (subgoal) => {
    setSelectedSubgoal(subgoal);
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

  const handleDelete = () => {
    dispatch(removeGoal(goal._id));
    window.location.reload();
  };

  return (
    <>
      {selectedTimeline && (
        <SelectedTimelineUnit
          unit={goal.timelineUnit}
          type={capitalizeFirstLetter(goal.timelineUnit.type)}
          handleClose={handleUnselectTimeline}
          selectedItemWidth={goalWidth}
        />
      )}

      {selectedSubgoal && (
        <SelectedGoal
          goal={selectedSubgoal}
          handleClose={handleSubgoalClose}
          goalWidth={goalWidth}
          recursiveCall={recursiveCall ? recursiveCall + 1 : 1}
        />
      )}

      {materialTypes.map(
        (materialType) =>
          materialType === selectedMaterialType && (
            <SelectedMaterial
              unit={selectedMaterial}
              type={materialType}
              handleUnselect={handleMaterialUnselect}
              dashboardWidth={goalWidth}
            />
          )
      )}

      <div
        className={styles.selectedGoal}
        style={{
          width: goalWidth,
          zIndex: recursiveCall && recursiveCall + 6,
        }}
      >
        <BackButton action={handleClose} />
        <OptionsButton action={handleOptionsSelect} isPreview={isPreview} />

        {isOptionsSelected && (
          <Options
            type={"Goal"}
            isEditMode={isEditMode}
            eventHandlers={{
              handleEditPreviewSwitch,
              handleDelete,
              handleOptionsClose,
            }}
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
              materialId={goal._id}
              type="goals"
            />
          )}
        </div>

        {editableElementsState &&
          editableElementsState.map((element, index) => (
            <React.Fragment key={element._id}>
              {element.type === "ICON" ? (
                <h3 className={styles.icon}>
                  <FaSignal />
                </h3>
              ) : element.type === "TITLE" ? (
                <Title
                  goal={{ plan: goal.plan, _id: goal._id }}
                  updateGoalPlan={(newPlan) => (goal.plan = newPlan)}
                  isEditMode={isEditMode}
                />
              ) : element.type === "TIMELINE" ? (
                <GoalTimeline
                  goal={goal}
                  handleTimelineSelect={handleTimelineSelect}
                />
              ) : element.type === "MATERIALS" ? (
                <Materials
                  goal={{
                    projects: goal.projects,
                    resources: goal.resources,
                    exercises: goal.exercises,
                  }}
                  handleMaterialSelect={handleMaterialSelect}
                  isEditMode={isEditMode}
                />
              ) : element.type === "COMPLETION" ? (
                goal && (
                  <Completion
                    goal={{
                      isComplete: goal.isComplete,
                      plan: goal.plan,
                      type: goal.type,
                      _id: goal._id,
                    }}
                    isPreview={isPreview}
                    updateGoalStatus={(isComplete) =>
                      (goal.isComplete = isComplete)
                    }
                  />
                )
              ) : element.type === "SUBGOALS" ? (
                goal && (
                  <Subgoals
                    subgoals={goal.subgoals}
                    handleSubgoalSelect={handleSubgoalSelect}
                    isEditMode={isEditMode}
                  />
                )
              ) : (
                <CoreEditables
                  element={{
                    ...element,
                    unit: { ...goal, type: "goals" },
                    index,
                  }}
                  isEditMode={isEditMode}
                  isHoverArrayState={{ isHoverArray, setIsHoverArray }}
                  editableElements={{
                    editableElementsState,
                    setEditableElementsState,
                    handleUpdateElement,
                    removeElementFromState,
                  }}
                />
              )}

              <div
                style={{
                  height: isImageArray[index + 1]
                    ? isImageArray[index + 1]
                    : index < isEditArray.length && isEditArray[index + 1]
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
                    materialId={goal._id}
                    type="goals"
                  />
                )}
              </div>
            </React.Fragment>
          ))}
      </div>
    </>
  );
};

export default SelectedGoal;
