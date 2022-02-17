import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editProjectTitle,
  getProjectData,
  removeProject,
} from "../../actions/projectActions";
import {
  editResourceTextData,
  getResourceData,
  removeResource,
} from "../../actions/resourceActions";
import Notepad from "../notepad/Notepad";
import AddNotepadScreen from "../screens/addScreens/addNotepadScreen/AddNotePadScreen";
import AddGoalsScreen from "../screens/addScreens/addGoalScreen/AddGoalsScreen";
import CoreEditables from "../editables/CoreEditables";
import AddElement from "../editables/addElement/AddElement";
import SelectedGoal from "../selectedGoal/SelectedGoal";
import Options from "../options/Options";
import Title from "./title/Title";
import Cover from "./cover/Cover";
import Thumbnail from "./thumbnail/Thumbnail";
import Authors from "./authors/Authors";
import PublishedDate from "./publishedDate/PublishedDate";
import Description from "./description/Description";
import DropDown from "../dropDown/DropDown";
import setIsPreview from "../../utils/setIsPreview";
import BackButton from "../backButton/BackButton";
import OptionsButton from "../optionsButton/OptionsButton";
import styles from "./SelectedMaterial.module.scss";
import ExerciseIcon from "./exerciseIcon/ExerciseIcon";
import { editExerciseTextData } from "../../actions/exerciseActions";
import replaceArrayElement from "../../utils/replaceArrayElement";

const addMaterialToNotes = (data, unit, type) => {
  if (data.notes) {
    if (type === "project") {
      data.notes.map((notepad) => (notepad.project = unit));
    } else if (type === "resource") {
      data.notes.map((notepad) => (notepad.resource = unit));
    } else if (type === "exercise") {
      data.notes.map((notepad) => (notepad.exercise = unit));
    }
  }
};

const SelectedMaterial = ({ unit, type, handleUnselect, dashboardWidth }) => {
  const { isPreview, hideEditMode } = setIsPreview();

  const dispatch = useDispatch();

  const unitData = useSelector((state) =>
    type === "project"
      ? state.projectData
      : type === "resource" && state.resourceData
  );
  const data = unitData && unitData.data;

  data && addMaterialToNotes(data, unit, type);

  useEffect(() => {
    if (type === "project") {
      dispatch(getProjectData(unit._id));
    } else if (type === "resource") {
      dispatch(getResourceData(unit._id));
    }
  }, [dispatch, type, unit._id]);

  const [isEditMode, setIsEditMode] = useState(!hideEditMode);

  const [editableElementsState, setEditableElementsState] = useState([]);

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

  const [isEditArray, setIsEditArray] = useState([]);
  const [isImageArray, setIsImageArray] = useState([]);
  const [isHoverArray, setIsHoverArray] = useState([]);

  const numberOfEditableElements = () =>
    unit && unit.editableElements && unit.editableElements.length;

  const saveTitle = () => {
    if (type === "project") {
      dispatch(editProjectTitle(unit.title, unit._id));
    } else if (type === "resource") {
      dispatch(editResourceTextData(unit.title, "title", unit._id));
    } else if (type === "exercise") {
      dispatch(editExerciseTextData(unit.title, unit._id));
    }
  };

  useEffect(() => {
    setEditableElementsState(unit.editableElements);

    const falseArray = Array(numberOfEditableElements()).fill(false);
    setIsEditArray(falseArray);
    setIsImageArray(falseArray);
    setIsHoverArray(falseArray);

    if (!hideEditMode) {
      sessionStorage.setItem("hideEditMode", true);
    }

    return () => saveTitle();
  }, [hideEditMode]);

  const [selectedGoal, setSelectedGoal] = useState(false);
  const [isAddGoalSelected, setIsAddGoalSelected] = useState(false);

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
  };

  const handleGoalClose = () => {
    setSelectedGoal(false);
  };

  const [isNotepadSelected, setIsNotepadSelected] = useState(false);
  const [selectedNotepad, setSelectedNotepad] = useState(null);
  const [isAddNotepadSelected, setIsAddNotepadSelected] = useState(false);

  const handleNotepadSelect = async (notepad) => {
    setSelectedNotepad(notepad);
    setIsNotepadSelected(true);
  };

  const handleNotepadClose = () => {
    setIsNotepadSelected(false);
  };

  const [isOptionsSelected, setIsOptionsSelected] = useState(!hideEditMode);
  const handleOptionsSelect = () => {
    setIsOptionsSelected((prev) => !prev);
  };
  const handleOptionsClose = () => {
    setIsOptionsSelected(false);
  };

  const handleDelete = () => {
    if (type === "project") {
      dispatch(removeProject(unit._id));
    } else if (type === "resource") {
      dispatch(removeResource(unit._id));
    }
    window.location.reload();
  };

  const handleEditPreviewSwitch = () => {
    if (isEditMode) {
      setIsEditArray(new Array(isEditArray.length).fill(false));
    }
    setIsEditMode((prev) => !prev);
  };

  const thumbnail = () =>
    unit.imageSrc
      ? unit.imageSrc
      : unit.image && `localhost:3000/uploads/image/${unit.image}`; //////////////////////////////////////////////////////////////////////

  return (
    <div
      className={`${styles.selectedMaterial} fade-in `}
      style={{ right: "calc(1.6% - 6px)", width: dashboardWidth }}
    >
      {isNotepadSelected && (
        <Notepad
          notepad={selectedNotepad}
          notepadWidth={dashboardWidth}
          handleClose={handleNotepadClose}
        />
      )}
      {isAddGoalSelected && (
        <AddGoalsScreen
          type={type}
          handleCloseAddScreen={() => setIsAddGoalSelected(false)}
          width={dashboardWidth}
        />
      )}
      {isAddNotepadSelected && (
        <AddNotepadScreen
          type={type}
          handleAdd={() => window.location.reload()}
          handleClose={() => setIsAddNotepadSelected(false)}
          dashboardWidth={dashboardWidth}
          selectedMaterial={unit}
        />
      )}

      {selectedGoal && (
        <SelectedGoal
          goal={selectedGoal}
          handleClose={handleGoalClose}
          goalWidth={dashboardWidth}
        />
      )}

      <BackButton action={handleUnselect} />
      <OptionsButton action={handleOptionsSelect} isPreview={isPreview} />

      {isOptionsSelected && (
        <Options
          type={type}
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
            materialId={unit._id}
            type={type + "s"}
          />
        )}
      </div>

      {editableElementsState &&
        editableElementsState.map((element, index) => {
          return (
            element && (
              <React.Fragment key={element._id}>
                {element.type === "TITLE" ? (
                  <Title
                    material={{
                      title: unit.title,
                      _id: unit._id,
                    }}
                    updateMaterialTitle={(title) => (unit.title = title)}
                    type={type}
                    isEditMode={isEditMode}
                  />
                ) : element.type === "ICON" ? (
                  <ExerciseIcon />
                ) : element.type === "THUMBNAIL" ? (
                  thumbnail() && <Thumbnail imageSrc={thumbnail()} />
                ) : element.type === "COVER" ? (
                  <Cover imageSrc={unit.imageSrc} />
                ) : element.type === "AUTHORS" ? (
                  <Authors
                    resource={{
                      authors: unit.authors,
                      _id: unit._id,
                    }}
                    updateResourceAuthors={(authors) => {
                      unit.authors = authors;
                    }}
                    isEditMode={isEditMode}
                  />
                ) : element.type === "PUBLISHEDDATE" ? (
                  <PublishedDate
                    resource={{
                      publishedDate: unit.publishedDate,
                      _id: unit._id,
                    }}
                    updateResourceDate={(date) => {
                      unit.publishedDate = date;
                    }}
                    isEditMode={isEditMode}
                  />
                ) : element.type === "DESCRIPTION" ? (
                  <Description
                    material={{ description: unit.description, _id: unit._id }}
                    updateMaterialDescription={(description) =>
                      (unit.description = description)
                    }
                    isEditMode={isEditMode}
                  />
                ) : element.type === "GOALS" ? (
                  <DropDown
                    items={{
                      goals: data && data.goals ? data.goals : [],
                      goalsType: type,
                    }}
                    isAddSelected={isAddGoalSelected}
                    setIsAddSelected={setIsAddGoalSelected}
                    handleSelect={handleGoalSelect}
                    isPreview={isPreview}
                  />
                ) : element.type === "NOTES" ? (
                  <DropDown
                    items={{
                      notes: data && data.notes ? data.notes : [],
                      notesType: type,
                    }}
                    isAddSelected={isAddNotepadSelected}
                    setIsAddSelected={setIsAddNotepadSelected}
                    handleSelect={handleNotepadSelect}
                    isPreview={isPreview}
                  />
                ) : (
                  <CoreEditables
                    element={{
                      ...element,
                      unit: { ...unit, type: type + "s" },
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
                      materialId={unit._id}
                      type={type + "s"}
                    />
                  )}
                </div>
              </React.Fragment>
            )
          );
        })}
    </div>
  );
};

export default SelectedMaterial;
