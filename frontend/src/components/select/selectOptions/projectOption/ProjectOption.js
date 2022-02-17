import React from "react";
import styles from "./ProjectOption.module.scss";

const ProjectOption = ({ option, isSelected }) => {
  return (
    <>
      {option.title && (
        <span className={styles.projectOption}>
          {option.imageSrc && (
            <img
              src={option.imageSrc}
              className={styles.thumbnail}
              alt={`Cover of ${option.title}`}
            />
          )}
          <span style={{ justifySelf: "center", marginTop: "4px" }}>
            <textarea
              className={`${styles.title} ${
                isSelected && styles.selectedTitle
              }`}
            >
              {option.title}
            </textarea>
          </span>
        </span>
      )}
    </>
  );
};

export default ProjectOption;
