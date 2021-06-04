import React from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./Button.module.scss";

const AddButton = ({ type, action }) => {
  return (
    <button className={styles.container} onClick={() => action && action()}>
      <span className={styles.iconContainer}>
        <FaPlus />
      </span>

      <div className={styles.messageContainer}>
        <p className={styles.message}>{`Add ${type}`}</p>
      </div>
    </button>
  );
};

export default AddButton;
