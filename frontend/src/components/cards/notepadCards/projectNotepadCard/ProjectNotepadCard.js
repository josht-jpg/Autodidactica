import styles from "./ProjectNotepadCard.module.scss";

const ProjectNotepadCard = ({ notepad }) => {
  return (
    <>
      <img
        className={styles.projectThumbnail}
        src={notepad.project.imageSrc}
        alt={`Notes on ${notepad.project.title}`}
      />

      <div className={styles.titleContainer}>
        <h3 className={styles.notepadName}>{notepad.name}</h3>
      </div>
      <p className={styles.projectTitle}>
        {"Notes on "} <i>{notepad.project.title}</i>
      </p>
    </>
  );
};

export default ProjectNotepadCard;
