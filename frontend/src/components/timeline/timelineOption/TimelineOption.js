import React from "react";
import styles from "./TimelineOption.module.scss";

const TimelineOption = ({ option, type, isSelected }) => {
  return (
    <div className={styles.timelineOption}>
      <textarea
        className={styles.title}
        style={{
          width: isSelected && "11rem",
          marginLeft: isSelected && "1rem",
        }}
      >
        {option.title && option.title.length > 0
          ? option.title
          : `${type} ${option.number}`}
      </textarea>
    </div>
  );
};

export default TimelineOption;
