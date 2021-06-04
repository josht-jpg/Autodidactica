import React, { useState, useEffect } from "react";
import { FaRegCircle, FaCheckCircle, FaDumbbell } from "react-icons/fa";
import styles from "./SmallGoalCard.module.scss";

const materialTypes = ["projects", "resources", "exercises"];

const singularize = (text) => {
  const result = text.slice(0, -1);
  return result;
};

const SmallGoalCard = ({ goal, type }) => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    let materialsInit = [];

    materialTypes.map((materialType) =>
      goal[materialType].map(
        (material) =>
          material &&
          materialsInit.push({
            image: material.imageSrc,
            title: material.title,
            type: singularize(materialType),
          })
      )
    );

    setMaterials(materialsInit);
  }, [goal]);

  return (
    <div className={styles.smallGoalCard}>
      <div style={{ alignSelf: "start" }}>
        <h3 className={styles.header}>{goal.plan}</h3>
      </div>
      <div className={styles.scrollableMaterialsContainer}>
        <div className={styles.flexContainer}>
          {materials.map((material) =>
            material.type === "exercise" ? (
              <h1 className={styles.exerciseIcon}>
                <FaDumbbell />
              </h1>
            ) : (
              <img
                src={material.image}
                className={
                  materials.length > 1
                    ? styles[material.type + "Multi"]
                    : styles[material.type + "Single"]
                }
                alt={`Cover of ${material.title}`}
              />
            )
          )}
        </div>
      </div>

      <div className={styles.checkContainer}>
        {goal.isComplete ? (
          <>
            <h3 className={styles.check}>
              <FaCheckCircle />
            </h3>
            <h3 className={styles.message}>Complete!</h3>
          </>
        ) : (
          <>
            <h3 className={styles.check}>
              <FaRegCircle />
            </h3>
            <h3 className={styles.message}>In Progress...</h3>
          </>
        )}
      </div>
    </div>
  );
};

export default SmallGoalCard;
