import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { changeStatus } from "../../../actions/goalActions";
import styles from "./Completion.module.scss";

const Completion = ({ goal, updateGoalStatus, isPreview }) => {
  const [isComplete, setIsComplete] = useState(goal.isComplete);

  const dispatch = useDispatch();

  const handleStatusChange = () => {
    dispatch(
      changeStatus(
        goal._id ? goal._id : { plan: goal.plan, type: goal.type },
        !isComplete
      )
    );
    updateGoalStatus(!isComplete);
    setIsComplete((prev) => !prev);
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <div style={{ marginTop: isPreview && "3%" }}>
        <div
          className={styles.container}
          style={
            isPreview
              ? { height: "25px" }
              : { height: "70px", marginBottom: "0px" }
          }
        >
          <h3 className={styles.completionCheck}>
            {isComplete ? <FaCheckCircle /> : <FaRegCircle />}
          </h3>
          <h3 className={styles.completionText}>
            {isComplete ? "Complete!" : "In Progress..."}
          </h3>
        </div>

        {!isPreview && (
          <button
            className={styles.statusButton}
            onClick={() => handleStatusChange()}
          >
            <p
              style={{
                margin: "auto",
                textAlign: "center",
              }}
            >
              {isComplete ? "Mark as incomplete" : "Mark as complete"}
            </p>
          </button>
        )}
      </div>
    </div>
  );
};

export default Completion;
