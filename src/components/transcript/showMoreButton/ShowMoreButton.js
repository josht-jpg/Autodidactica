import React from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import styles from "./ShowMoreButton.module.scss";

const ShowMoreButton = ({ type, action, isArrowDown }) => {
  return (
    <div className={styles.container}>
      <button
        className={styles.showMoreButton}
        onClick={() => action && action()}
      >
        {isArrowDown ? (
          <span className={styles.arrow}>
            <FaAngleDown />
          </span>
        ) : (
          <span className={styles.arrow}>
            <FaAngleUp />
          </span>
        )}
        <div className={styles.messageContainer}>
          <p className={styles.message}>{`Show ${type}`}</p>
        </div>
      </button>
    </div>
  );
};

export default ShowMoreButton;
