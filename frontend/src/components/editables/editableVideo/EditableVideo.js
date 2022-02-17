import { useDispatch } from "react-redux";
import { FiTrash } from "react-icons/fi";
import ReactPlayer from "react-player";
import styles from "./EditableVideo.module.scss";
import sanitizeLink from "../../../utils/sanitizeLink";
import { editCaption } from "../../../actions/editablesActions";
import showTrashIcon from "../../../utils/editables/showTrashIcon";
import handleMouseEvent from "../../../utils/editables/handleMouseEvent";
import { useState } from "react";

const EditableVideo = ({
  element,
  isEditMode,
  isHoverArrayState,
  handleUpdateElement,
  handleRemoveElement,
}) => {
  const { unit, index } = element;

  const [captionState, setCaptionState] = useState(element.caption);

  const dispatch = useDispatch();

  const handleCaptionChange = (e, index) => {
    dispatch(editCaption(e.target.value, element._id, unit._id, unit.type));
    const elementWithNewCaption = (caption) => {
      return { ...element, caption };
    };
    handleUpdateElement(elementWithNewCaption(e.target.value), index);
    setCaptionState(e.target.value);
  };

  return (
    <div
      className={styles.videoContainer}
      onMouseEnter={() =>
        handleMouseEvent(isHoverArrayState.setIsHoverArray, index, true)
      }
      onMouseLeave={() =>
        handleMouseEvent(isHoverArrayState.setIsHoverArray, index, false)
      }
    >
      <ReactPlayer
        id={element._id.toString()}
        style={{ maxWidth: "80%" }}
        url={sanitizeLink(element.url)}
        controls={true}
      />

      {showTrashIcon(isEditMode, isHoverArrayState.isHoverArray, index) && (
        <span
          className={styles.deleteVideo}
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

      <div
        className={styles.caption}
        style={{
          height: isEditMode ? "15px" : "0",
        }}
      >
        {isEditMode ? (
          <textarea
            className={styles.caption}
            type="text"
            placeholder={captionState ? captionState : "Caption"}
            value={captionState}
            onChange={(e) => handleCaptionChange(e, index)}
          />
        ) : (
          <h3>{captionState}</h3>
        )}
      </div>
    </div>
  );
};

export default EditableVideo;
