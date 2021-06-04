import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { addUnit } from "../../../../actions/timelineActions";
import AddGoalsScreen from "../addGoalScreen/AddGoalsScreen";
import Title from "./title/Title";
import SetDate from "./setDate/SetDate";
import AddGoals from "./addGoals/AddGoals";
import styles from "./AddTimelineScreen.module.scss";
import BackButton from "../backButton/BackButton";

const AddTimelineScreen = ({
  timelineUnit,
  handleCloseAddScreen,
  width,
  currentDate,
  number,
}) => {
  const newGoalsState = useState([]);
  const [newGoals, setNewGoals] = newGoalsState;

  const dispatch = useDispatch();

  const handleAddGoal = (
    plan,
    newGoalProjects,
    newGoalBooks,
    newGoalExercises,
    newSubgoals,
    _id
  ) => {
    setNewGoals((prev) => [
      ...prev.slice(0, prev.length - 1),
      {
        plan,
        projects: newGoalProjects,
        resources: newGoalBooks,
        exercises: newGoalExercises,
        subgoals: newSubgoals,
        _id,
      },
    ]);
  };

  const isNewGoalSelectedState = useState(false);
  const [isNewGoalSelected, setIsNewGoalSelected] = isNewGoalSelectedState;

  const handleCloseNewGoal = () => {
    setIsNewGoalSelected(false);
  };

  const dateState = useState(false);
  const [date] = dateState;

  const titleState = useState("");
  const [title] = titleState;

  const titleExists = () => title.replace(/\s/g, "").length > 0;

  const createTitle = () =>
    titleExists()
      ? `${timelineUnit} ${number}: ${title}`
      : `${timelineUnit} ${number}`;

  const createUnit = () => {
    return { goals: newGoals, title: createTitle(), date };
  };

  const submitHandler = async () => {
    dispatch(addUnit(createUnit(), timelineUnit.toLowerCase()));
    handleCloseAddScreen();
  };

  const submitMessage = `Create ${`${timelineUnit} ${number}`}`;

  return (
    <>
      {isNewGoalSelected && (
        <AddGoalsScreen
          handleAddGoal={handleAddGoal}
          handleCloseAddScreen={handleCloseNewGoal}
          width={width}
          timeline={{ type: timelineUnit, number }}
        />
      )}
      <div className={styles.addTimelineScreen} style={{ width }}>
        <BackButton action={handleCloseAddScreen} />

        <div>
          <Title
            titleState={titleState}
            timelineUnit={timelineUnit}
            number={number}
          />

          <hr className={styles.divider} />

          <SetDate
            dateState={dateState}
            currentDate={currentDate}
            number={number}
            timelineUnit={timelineUnit}
          />

          <hr className={styles.divider} />

          <AddGoals
            newGoalsState={newGoalsState}
            isNewGoalSelectedState={isNewGoalSelectedState}
          />

          <hr className={styles.divider} />
        </div>

        <div style={{ alignSelf: "end" }}>
          <button className={styles.submit} onClick={() => submitHandler()}>
            {submitMessage}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddTimelineScreen;
