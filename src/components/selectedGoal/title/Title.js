import { useState } from "react";
import { useDispatch } from "react-redux";
import TextAreaAutosize from "react-textarea-autosize";
import { editPlan } from "../../../actions/goalActions";
import styles from "./Title.module.scss";

const Title = ({ goal, updateGoalPlan, isEditMode }) => {
  const [planState, setPlanState] = useState(goal.plan);

  const dispatch = useDispatch();

  const changePlan = (e) => {
    goal.plan = e.target.value;
    dispatch(editPlan(e.target.value, goal._id));
    updateGoalPlan(e.target.value);
    setPlanState(e.target.value);
  };

  return (
    <div>
      <h3 className={styles.textAreaHeader}>{isEditMode && "Goal"}</h3>
      <div className={styles.titleContainer}>
        <TextAreaAutosize
          className={styles.title}
          style={{
            color: !isEditMode && "black",
            border: isEditMode ? "1px solid black" : "none",
            boxShadow: isEditMode ? "0 0 2px grey" : "none",
            borderRadius: isEditMode && "3px",
            minWidth: isEditMode && "100px",
          }}
          onChange={(e) => changePlan(e)}
          value={planState || isEditMode ? planState : "Goal"}
          disabled={!isEditMode}
        />
      </div>
      {!isEditMode && (
        <hr
          style={{
            width: `${goal.plan ? goal.plan.length * 16 : 75}px`,
            marginTop: "4px",
            marginBottom: "15px",
          }}
        />
      )}
    </div>
  );
};

export default Title;
