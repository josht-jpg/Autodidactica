import React from "react";
import { FaDumbbell } from "react-icons/fa";
import styles from "./Goals.module.scss";

const Goals = ({ goals }) => {
  return goals.map((goal) => (
    <React.Fragment key={`timeline-block-goal-${goal._id}`}>
      <h3 className={styles.goalTitle}>{goal.plan}</h3>

      <div className={styles.imagesContainer}>
        {goal.projects.map(
          (project) =>
            project && (
              <img
                src={project.imageSrc}
                key={`${project._id}-cover`}
                className={styles.projectThumbnail}
                alt={`Cover of ${project.title}`}
              />
            )
        )}
        {goal.resources.map((resource) => (
          <img
            src={resource.imageSrc}
            key={`${resource._id}-cover`}
            className={styles.bookCover}
            alt={`Cover of ${resource.title}`}
          />
        ))}

        {goal.exercises.length > 0 && (
          <h1 className={styles.exerciseIcon}>
            <FaDumbbell />
          </h1>
        )}
      </div>
    </React.Fragment>
  ));
};

export default Goals;
