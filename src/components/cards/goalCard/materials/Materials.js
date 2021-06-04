import { FaDumbbell } from "react-icons/fa";
import styles from "./Materials.module.scss";

const Materials = ({ materials }) => {
  return (
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
  );
};

export default Materials;
