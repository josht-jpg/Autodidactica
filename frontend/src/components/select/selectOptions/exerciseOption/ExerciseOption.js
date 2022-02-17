import React from "react";
import styles from "./ExerciseOption.module.scss";

const ExerciseOption = ({ option, isSelected }) => {
  return (
    <>
      {option.title && (
        <div className={styles.exerciseOption}>
          <textarea
            className={`${styles.title} ${isSelected && styles.selectedTitle}`}
          >
            {option.title}
          </textarea>
        </div>
      )}
    </>
  );
};

export default ExerciseOption;
