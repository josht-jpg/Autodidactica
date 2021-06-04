import React from "react";
import { FaDumbbell } from "react-icons/fa";
import styles from "./GoalOption.module.scss";

const GoalOption = ({ option, isSelected }) => {
  const gatherImages = () => {
    let result = [];
    option.projects.map(
      (project) =>
        project &&
        result.push({
          image: project.imageSrc,
          title: project.title,
          type: "project",
        })
    );

    option.resources.map(
      (resource) =>
        resource &&
        result.push({
          image: resource.imageSrc,
          title: resource.title,
          type: "resource",
        })
    );

    //change
    if (option.exercise) {
      result.push({ type: "Exercise" });
    }

    return result.slice(0, 4);
  };

  return (
    Object.keys(option).length > 0 && (
      <span className="book-option">
        <span className={styles.imageContainer}>
          {gatherImages().map((imageObj, index) => {
            return (
              <React.Fragment
                key={`goal-option-image-${index}-${imageObj.title}`}
              >
                {imageObj.type === "project" ? (
                  <img
                    src={imageObj.image}
                    className={
                      styles[`projectThumbnail${gatherImages().length}`]
                    }
                    alt={`Cover of ${imageObj.title}`}
                  />
                ) : imageObj.type === "resource" ? (
                  <img
                    src={imageObj.image}
                    className={styles[`bookCover${gatherImages().length}`]}
                    alt={`Cover of ${imageObj.title}`}
                  />
                ) : (
                  <h3 className={styles.exerciseIcon}>
                    <FaDumbbell />
                  </h3>
                )}
              </React.Fragment>
            );
          })}
        </span>

        <span>
          <textarea
            className={`${styles.title} ${isSelected && styles.selectedTitle}`}
          >
            {option.plan}
          </textarea>
        </span>
      </span>
    )
  );
};

export default GoalOption;
