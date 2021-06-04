import React, { useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { MAIN_BLUE } from "../../constants/styleConstants";
import useOutsideAlerter from "../../customHooks/useOutsideAlerter";
import styles from "./Options.module.scss";

const Options = ({ type, editMessage, isEditMode, eventHandlers }) => {
  const { handleEditPreviewSwitch, handleDelete, handleOptionsClose } =
    eventHandlers;

  const optionsRef = useRef(null);
  useOutsideAlerter(optionsRef, handleOptionsClose);

  const isTimeline = () =>
    type.startsWith("Day") ||
    type.startsWith("Week") ||
    type.startsWith("Month") ||
    type.startsWith("Quarter") ||
    type.startsWith("Year");

  return (
    <div style={{ position: "relative" }}>
      <div
        className={styles.options}
        style={{ height: isTimeline() && "60px" }}
        ref={optionsRef}
      >
        <p
          className={styles.button}
          style={{
            color: isEditMode && MAIN_BLUE,
          }}
          onClick={handleEditPreviewSwitch}
        >
          <FaRegEdit /> {`Edit ${editMessage ? editMessage : type}`}
        </p>
        {!isTimeline() && (
          <p className={styles.button} onClick={handleDelete}>
            <FiTrash /> {`Delete ${type}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default Options;
