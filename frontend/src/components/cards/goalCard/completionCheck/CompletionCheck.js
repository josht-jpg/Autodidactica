import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import styles from "./CompletionCheck.module.scss";

const CompletionCheck = ({ isComplete }) => {
  return (
    <div className={styles.container}>
      {isComplete ? (
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
  );
};

export default CompletionCheck;
