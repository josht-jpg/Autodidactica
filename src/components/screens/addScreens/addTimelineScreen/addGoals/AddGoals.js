import { useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { listGoals } from "../../../../../actions/goalActions";
import {
  MultiValueContainer,
  MultiValueRemove,
} from "../../../../select/MultiValue";
import Select from "react-select";
import GoalOption from "../../../../select/selectOptions/goalOption/GoalOption";
import styles from "./AddGoals.module.scss";

const AddGoals = ({ newGoalsState, isNewGoalSelectedState }) => {
  const [newGoals, setNewGoals] = newGoalsState;
  const [isNewGoalSelected, setIsNewGoalSelected] = isNewGoalSelectedState;

  const dispatch = useDispatch();

  const goalList = useSelector((state) => state.goalList);
  const { goals } = goalList;

  useEffect(() => {
    dispatch(listGoals());
  }, [dispatch]);

  const addNewGoal = () => {
    setNewGoals((prev) => [...prev, null]);
  };

  const handleGoalsChange = (val, index) => {
    const temp = [...newGoals];
    temp[temp.length - 1 - index] = val[0];
    setNewGoals(temp);
  };

  const handleGoalEntryClose = (index) => {
    setNewGoals((prev) => [
      ...prev.slice(0, prev.length - 1 - index),
      ...prev.slice(prev.length - index),
    ]);
  };

  return (
    <>
      <div>
        <h3 className={styles.header}>Add Goals</h3>

        <FaPlusCircle
          className={styles.plusButton}
          onClick={() => addNewGoal()}
        />
      </div>

      {newGoals
        .slice()
        .reverse()
        .map((goal, index) => (
          <div key={`${index}-goal`} className={styles.newGoalContainer}>
            <div className={styles.formContainer}>
              <div style={{ marginBottom: "8px", paddingBottom: "20px" }}>
                <button
                  className={styles.closeButton}
                  onClick={() => handleGoalEntryClose(index)}
                >
                  x
                </button>
              </div>

              <div onClick={() => setIsNewGoalSelected(!goal)}>
                <h3
                  className={
                    goal
                      ? styles.newGoalButtonDisabled
                      : styles.newGoalButtonActive
                  }
                >
                  Create new Goal
                </h3>
              </div>
              <p className={styles.or}>or</p>

              <label className={styles.inputLabel}>Pick from your Goals</label>
              {!isNewGoalSelected && !isNewGoalSelected && (
                <Select
                  isMulti
                  value={goal}
                  name="goal"
                  className="basic-multi-select"
                  placeholder=""
                  options={!goal && goals}
                  isSearchable={!goal}
                  getOptionLabel={(option) => <GoalOption option={option} />}
                  getOptionValue={(option) => option.plan}
                  components={{ MultiValueRemove, MultiValueContainer }}
                  styles={{
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "transparent",
                    }),
                  }}
                  onChange={(val) => handleGoalsChange(val, index)}
                />
              )}
            </div>
          </div>
        ))}
    </>
  );
};

export default AddGoals;
