import { FiTrash } from "react-icons/fi";
import handleMouseEvent from "../../../utils/editables/handleMouseEvent";
import showTrashIcon from "../../../utils/editables/showTrashIcon";
import styles from "./EditableDivider.module.scss";

const EditableDivider = ({
  element,
  isEditMode,
  isHoverArrayState,
  handleRemoveElement,
}) => {
  const { index } = element;
  return (
    <div
      className={styles.dividerContainer}
      onMouseEnter={() =>
        handleMouseEvent(isHoverArrayState.setIsHoverArray, index, true)
      }
      onMouseLeave={() =>
        handleMouseEvent(isHoverArrayState.setIsHoverArray, index, false)
      }
    >
      {showTrashIcon(isEditMode, isHoverArrayState.isHoverArray, index) && (
        <span className={styles.deleteDivider}>
          <FiTrash
            className={styles.trashIcon}
            onClick={() => handleRemoveElement(index, element._id)}
          />
        </span>
      )}
      <hr className={styles.divider} />
    </div>
  );
};

export default EditableDivider;
