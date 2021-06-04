import { FaDumbbell } from "react-icons/fa";
import styles from "./MaterialSection.module.scss";

const MaterialSection = ({ materials, type, handleSelect, isEditMode }) => {
  return (
    <div className={styles.container}>
      {materials.map((material) => {
        return (
          material && (
            <div
              key={`goal-material-${material._id}`}
              className={styles.material}
              style={{ cursor: isEditMode && "default" }}
              onClick={() => handleSelect(material, type)}
            >
              <div style={{ display: "flex", height: "2rem" }}>
                <h3 className={styles.title}>{material.title}</h3>
              </div>
              <div className={styles.thumbnailContainer}>
                {type === "project" ? (
                  <img
                    className={styles.projectThumbnail}
                    src={material.imageSrc}
                    alt={material.title}
                  />
                ) : type === "resource" ? (
                  <img
                    className={styles.bookCover}
                    src={material.imageSrc}
                    alt={material.title}
                  />
                ) : (
                  type === "exercise" && (
                    <h1 className={styles.exerciseIcon}>
                      <FaDumbbell />
                    </h1>
                  )
                )}
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default MaterialSection;
