import { FiTrash } from "react-icons/fi";
import handleMouseEvent from "../../../utils/editables/handleMouseEvent";
import showTrashIcon from "../../../utils/editables/showTrashIcon";
import sanitizeLink from "../../../utils/sanitizeLink";
import styles from "./EditableImage.module.scss";

const EditableImage = ({
  element,
  isEditMode,
  isHoverArrayState,
  handleRemoveElement,
}) => {
  const { index } = element;

  return (
    <div
      className={styles.imageContainer}
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
      <img
        className={styles.image}
        id={element._id.toString()}
        src={
          element.url.isUploaded ? element.url.file : sanitizeLink(element.url)
        }
        alt={"Editable Image"}
      />
      {showTrashIcon(
        isEditMode,
        isHoverArrayState && isHoverArrayState.isHoverArray,
        index
      ) && (
        <span
          className={styles.deleteImage}
          style={{
            right: `calc(45% - ${
              document.getElementById(element._id.toString()).offsetWidth / 2
            }px )`,
          }}
        >
          <FiTrash
            className={styles.trashIcon}
            onClick={() => handleRemoveElement(index, element._id)}
          />
        </span>
      )}
    </div>
  );
};

export default EditableImage;
