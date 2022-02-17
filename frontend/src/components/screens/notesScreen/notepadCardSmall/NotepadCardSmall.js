import React from "react";
import { FaStickyNote } from "react-icons/fa";
import styles from "./NotepadCardSmall.module.scss";

const NotepadCardSmall = ({ notepad, handleNotepadSelect }) => {
  const materialTitle = () =>
    notepad.project
      ? notepad.project.title
      : notepad.resource && notepad.resource.title;

  return (
    <span
      className={styles.notepadCardSmall}
      onClick={() => handleNotepadSelect && handleNotepadSelect(notepad)}
    >
      {notepad.exercise ? (
        <>
          <h1 className={styles.notepadName}>{notepad.name}</h1>
          <hr className={styles.divider} />
          <h3
            className={styles.exerciseDetails}
            style={{
              marginBottom: "0px",
            }}
          >
            Notes on
          </h3>
          <h3 className={styles.exerciseDetails}>
            <i>{notepad.exercise.title}</i>
          </h3>
        </>
      ) : notepad.project || notepad.resource ? (
        <>
          {notepad.project ? (
            <img
              className={styles.projectThumbnail}
              src={notepad.project.imageSrc}
            />
          ) : (
            <img
              className={styles.bookCover}
              src={notepad.resource && notepad.resource.imageSrc}
            />
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <h3 className={styles.notepadName}>{notepad.name}</h3>
          </div>
          <p className={styles.details}>
            <i>{materialTitle()}</i>
          </p>
        </>
      ) : (
        <div className={styles.defaultContainer}>
          <h1 className={styles.defaultNotepadName}>
            <FaStickyNote className={styles.icon} /> {notepad.name}
          </h1>
        </div>
      )}
    </span>
  );
};

export default NotepadCardSmall;
