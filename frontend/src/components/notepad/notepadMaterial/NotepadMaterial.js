import { FaDumbbell } from "react-icons/fa";
import styles from "./NotepadMaterial.module.scss";

const notesOnMessage = "Notes on ";

const NotepadMaterial = ({ material, materialType, handleSelect }) => {
  return (
    <div
      className={styles.container}
      style={{
        marginTop: materialType === "exercise" ? "1.55rem" : "2rem",
        paddingLeft: materialType === "resource" && "2%",
      }}
    >
      {materialType === "exercise" ? (
        <p className={styles.exerciseIcon}>
          <FaDumbbell />
        </p>
      ) : (
        <img
          className={
            materialType === "resource"
              ? styles.bookCover
              : styles.projectThumbnail
          }
          src={material.imageSrc}
          onClick={handleSelect}
        />
      )}

      <h3
        style={{
          marginTop: materialType === "exercise" && "-10px",
        }}
        className={styles.materialLink}
      >
        {notesOnMessage}
        <i className={styles.clickable} onClick={handleSelect}>
          {material.title}
        </i>
      </h3>
    </div>
  );
};

export default NotepadMaterial;
