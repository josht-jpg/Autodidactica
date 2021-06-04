import styles from "./Exercises.module.scss";

const Exercises = ({ exercises }) => {
  return exercises.map(
    (exercise) =>
      exercise && (
        <div
          key={`exercise-display-${exercise._id}`}
          className={styles.container}
        >
          <p className={`${styles.title} four-line-title`}>{exercise.title}</p>
        </div>
      )
  );
};

export default Exercises;
