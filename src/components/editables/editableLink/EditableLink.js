import { FiTrash } from "react-icons/fi";
import handleMouseEvent from "../../../utils/editables/handleMouseEvent";
import showTrashIcon from "../../../utils/editables/showTrashIcon";
import sanitizeLink from "../../../utils/sanitizeLink";
import styles from "./EditableLink.module.scss";

const EditableLink = ({
  element,
  isEditMode,
  isHoverArrayState,
  handleRemoveElement,
}) => {
  const { index } = element;

  return (
    <div
      className={styles.linkContainer}
      onMouseEnter={() =>
        handleMouseEvent(isHoverArrayState.setIsHoverArray, index, true)
      }
      onMouseLeave={() =>
        handleMouseEvent(isHoverArrayState.setIsHoverArray, index, false)
      }
    >
      {showTrashIcon(isEditMode, isHoverArrayState.isHoverArray, index) && (
        <span className={styles.deleteLink}>
          <FiTrash
            className={styles.trashIcon}
            onClick={() => handleRemoveElement(index, element._id)}
          />
        </span>
      )}

      <a
        href={sanitizeLink(element.url)}
        target="_blank"
        rel="noreferrer"
        className={styles.link}
      >
        {element.title}
      </a>
    </div>
  );
};

export default EditableLink;
