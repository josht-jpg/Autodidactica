import EditNotepad from "./editNotepad/EditNotepad";
import styles from "./EditableText.module.scss";
import { FiTrash } from "react-icons/fi";
import handleMouseEvent from "../../../utils/editables/handleMouseEvent";
import showTrashIcon from "../../../utils/editables/showTrashIcon";

const EditableText = ({
  element,
  isEditMode,
  isAddSubjectScreen,
  isHoverArrayState,
  handleUpdateElement,
  handleRemoveElement,
}) => {
  const { unit, index } = element;

  return (
    <div
      className={styles.textContainer}
      style={{
        zIndex: isAddSubjectScreen && -1,
      }}
      onMouseEnter={() =>
        handleMouseEvent(
          isHoverArrayState && isHoverArrayState.setIsHoverArray,
          index,
          true
        )
      }
      onMouseLeave={() =>
        handleMouseEvent(
          isHoverArrayState && isHoverArrayState.setIsHoverArray,
          index,
          false
        )
      }
    >
      {showTrashIcon(
        isEditMode,
        isHoverArrayState && isHoverArrayState.isHoverArray,
        index
      ) && (
        <span className={styles.deleteText}>
          <FiTrash
            className={styles.trashIcon}
            onClick={() => handleRemoveElement(index, element._id)}
          />
        </span>
      )}
      <EditNotepad
        element={{
          ...element,
          updateText: (text) =>
            handleUpdateElement &&
            handleUpdateElement({ ...element, text }, index),
        }}
        materialId={unit._id}
        isEditMode={isEditMode}
        index={index + 1}
        type={unit.type}
      />
    </div>
  );
};

export default EditableText;
