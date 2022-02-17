import { FaDumbbell } from "react-icons/fa";
import styles from "./ExerciseCard.module.scss";

const ExerciseCard = ({ exercise }) => {
  return (
    <>
      <p className={styles.icon}>
        <FaDumbbell />
      </p>
      <h3 className={styles.title}>{exercise.title}</h3>
      {exercise.description && <hr width="90%" />}
      <p className={styles.description}>{exercise.description}</p>
    </>
  );
};

export default ExerciseCard;
