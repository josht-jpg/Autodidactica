import styles from "./ResourceNotepadCard.module.scss";

const ResourceNotepadCard = ({ notepad }) => {
  return (
    <>
      <img
        className={styles.bookCover}
        src={notepad.resource.imageSrc}
        alt={`Notes on ${notepad.resource.title}`}
      />

      <div className={styles.titleContainer}>
        <h3 className={styles.notepadName}>{notepad.name}</h3>
      </div>
      <p className={styles.resourceTitle}>
        {"Notes on "} <i>{notepad.resource.title}</i>
      </p>
    </>
  );
};

export default ResourceNotepadCard;
