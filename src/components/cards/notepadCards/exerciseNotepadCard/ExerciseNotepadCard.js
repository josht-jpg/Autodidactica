import styles from "./ExerciseNotepadCard.module.scss";

const ExerciseNotepadCard = ({ notepad }) => {
  return (
    <>
      <h1 className={styles.notepadName}>{notepad.name}</h1>
      <hr className={styles.divider} />
      <h3 className={styles.details}>
        Notes on
        <br />
        <i className={styles.exerciseTitle}>{notepad.exercise.title}</i>
      </h3>
    </>
  );
};

export default ExerciseNotepadCard;
