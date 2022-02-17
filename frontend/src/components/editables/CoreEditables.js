import React from "react";
import { useDispatch } from "react-redux";
import { removeElement } from "../../actions/editablesActions";
import EditableText from "./editableText/EditableText";
import EditableVideo from "./editableVideo/EditableVideo";
import EditableImage from "./editableImage/EditableImage";
import EditableLink from "./editableLink/EditableLink";
import EditableDivider from "./editableDivider/EditableDivider";

const CoreEditables = ({
  element,
  isEditMode,
  isHoverArrayState,
  editableElements,
  isAddSubjectScreen,
}) => {
  const { unit } = element;

  const dispatch = useDispatch();

  const handleRemoveElement = (index, elementId) => {
    editableElements.removeElementFromState(index);

    const falseArray = Array(isHoverArrayState.isHoverArray.length).fill(false);
    isHoverArrayState.setIsHoverArray(falseArray);

    dispatch(removeElement(elementId, unit._id, unit.type));
  };

  return (
    <>
      {element.type === "TEXT" ? (
        <EditableText
          element={element}
          isEditMode={isEditMode}
          isAddSubjectScreen={isAddSubjectScreen}
          isHoverArrayState={isHoverArrayState}
          handleUpdateElement={editableElements.handleUpdateElement}
          handleRemoveElement={handleRemoveElement}
        />
      ) : element.type === "VIDEO" ? (
        <EditableVideo
          element={element}
          isEditMode={isEditMode}
          isHoverArrayState={isHoverArrayState}
          handleUpdateElement={editableElements.handleUpdateElement}
          handleRemoveElement={handleRemoveElement}
        />
      ) : element.type === "IMAGE" ? (
        <EditableImage
          element={element}
          isEditMode={isEditMode}
          isHoverArrayState={isHoverArrayState}
          handleRemoveElement={handleRemoveElement}
        />
      ) : element.type === "LINK" ? (
        <EditableLink
          element={element}
          isEditMode={isEditMode}
          isHoverArrayState={isHoverArrayState}
          handleRemoveElement={handleRemoveElement}
        />
      ) : (
        element.type === "DIVIDER" && (
          <EditableDivider
            element={element}
            isEditMode={isEditMode}
            isHoverArrayState={isHoverArrayState}
            handleRemoveElement={handleRemoveElement}
          />
        )
      )}
    </>
  );
};

export default CoreEditables;
