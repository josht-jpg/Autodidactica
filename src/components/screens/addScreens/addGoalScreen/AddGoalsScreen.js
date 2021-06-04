import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSignal } from "react-icons/fa";
import { addGoal, getAddGoalScreenData } from "../../../../actions/goalActions";
import AddScreen from "../addScreen/AddScreen";
import AddMaterial from "./addMaterial/AddMaterial";
import TimelineSelect from "./TimelineSelect.module.scss/TimelineSelect";
import generateMongoId from "../../../../utils/generateMongoId";
import styles from "./AddGoalsScreen.module.scss";
import Loader from "../../../Loader";
import BackButton from "../backButton/BackButton";
import capitalizeFirstLetter from "../../../../utils/capitalizeFirstLetter";
import replaceLastElement from "../../../../utils/replaceLastElement";

const materialTypes = ["project", "book", "exercise", "subgoal"];

const filterOutNulls = (newMaterials) =>
  newMaterials.filter((material) => material);

const AddGoalsScreen = ({
  width,
  handleAddGoal,
  handleCloseAddScreen,
  timeline,
  nestLevel,
}) => {
  const [plan, setPlan] = useState("");
  const [day, setDay] = useState("");
  const [week, setWeek] = useState("");
  const [month, setMonth] = useState("");
  const [quarter, setQuarter] = useState("");

  const addGoalScreenData = useSelector((state) => state.addGoalScreenData);
  const { projects, books, exercises, goals, timelineTitles, loading } =
    addGoalScreenData;

  const materials = { projects, books, exercises, subgoals: goals };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAddGoalScreenData());
  }, [dispatch]);

  const newProjectState = useState([]);
  const newBooksState = useState([]);
  const newExercisesState = useState([]);
  const subGoalsState = useState([]);

  const [newProjects, setNewProjects] = newProjectState;
  const [newBooks, setNewBooks] = newBooksState;
  const [newExercises, setNewExercises] = newExercisesState;
  const [subGoals, setSubGoals] = subGoalsState;

  const newMaterialsState = {
    project: newProjectState,
    book: newBooksState,
    exercise: newExercisesState,
    subgoal: subGoalsState,
  };

  const [addMaterialType, setAddMaterialType] = useState(false);

  const [isNewSubGoalSelected, setIsNewSubGoalSelected] = useState(false);

  const handleNewProject = (title, imageSrc, _id) => {
    setNewProjects((prev) =>
      replaceLastElement(prev, { title, imageSrc, _id })
    );
  };

  const handleNewBook = (book) => {
    setNewBooks((prev) =>
      replaceLastElement(prev, {
        title: book.title,
        imageSrc: book.imageSrc,
        _id: book._id,
      })
    );
  };

  const handleNewExercise = (title, _id) => {
    setNewExercises((prev) => replaceLastElement(prev, { title, _id }));
  };

  const newMaterialHandlers = {
    handleNewProject,
    handleNewBook,
    handleNewExercise,
  };

  const handleNewSubgoal = (
    plan,
    subgoalProjects,
    subgoalBooks,
    subgoalExercises,
    subSubgoals
  ) => {
    setSubGoals((prev) =>
      replaceLastElement(prev, {
        plan,
        projects: subgoalProjects,
        resources: subgoalBooks,
        exercises: subgoalExercises,
        subgoals: subSubgoals,
      })
    );
  };

  const handleCloseNewSubGoalScreen = () => {
    setIsNewSubGoalSelected(false);
  };

  const handleTimelineChange = (selectedUnit, type) => {
    timeline = { type, number: selectedUnit && selectedUnit.number };
    type === "Day"
      ? setDay(selectedUnit)
      : type === "Week"
      ? setWeek(selectedUnit)
      : type === "Month" && setMonth(selectedUnit);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    let newProjectsFiltered = filterOutNulls(newProjects);
    let newBooksFiltered = filterOutNulls(newBooks);
    let newExercisesFiltered = filterOutNulls(newExercises);
    let subGoalsFiltered = filterOutNulls(subGoals);

    let _id = generateMongoId();

    await dispatch(
      addGoal(
        plan,
        newProjectsFiltered.map((_project) => _project._id),
        newBooksFiltered.map((_book) => _book._id),
        newExercisesFiltered.map((_exercise) => _exercise._id),
        subGoalsFiltered,
        timeline && timeline.type === "Day"
          ? timeline.number
          : day && day.number,
        timeline && timeline.type === "Week"
          ? timeline.number
          : week && week.number,
        timeline && timeline.type === "Month"
          ? timeline.number
          : month && month.number,
        timeline && timeline.type === "Quarter"
          ? timeline.number
          : quarter && quarter.number,
        _id
      )
    );
    if (handleAddGoal) {
      handleAddGoal(
        plan,
        newProjectsFiltered,
        newBooksFiltered,
        newExercisesFiltered,
        subGoalsFiltered,
        _id
      );
    }

    handleCloseAddScreen();
  };

  const showSelect = (materialType) =>
    materialType !== addMaterialType && addMaterialType !== "exercise";

  return (
    <>
      {addMaterialType && (
        <AddScreen
          type={addMaterialType}
          handleAdd={
            newMaterialHandlers[
              `handleNew${capitalizeFirstLetter(addMaterialType)}`
            ]
          }
          handleCloseAddScreen={() => setAddMaterialType(false)}
          nestLevel={nestLevel}
          width={width}
        />
      )}

      {isNewSubGoalSelected && (
        <AddGoalsScreen
          handleAddGoal={handleNewSubgoal}
          width={width}
          handleCloseAddScreen={handleCloseNewSubGoalScreen}
          nestLevel={nestLevel ? nestLevel + 1 : 1}
        />
      )}

      <div
        className={`${styles.addGoalsScreen} scroll-bar fade-in`}
        style={{
          width,
          zIndex: `${nestLevel ? 1006 + nestLevel : 1006}`,
        }}
      >
        {loading ? (
          <Loader style={{ justifySelf: "center", marginTop: "38vh" }} />
        ) : (
          <>
            <BackButton action={handleCloseAddScreen} />
            <form onSubmit={submitHandler} className={styles.form} noValidate>
              <h1>
                <FaSignal />
              </h1>
              <div
                className={styles.formContainer}
                style={{ marginBottom: timeline ? "5rem" : "4rem" }}
              >
                <label className={styles.label}>Goal</label>
                <input
                  className={styles.input}
                  type="text"
                  name="plan"
                  placeholder={"e.g. Read for 1 hour"}
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                />
              </div>

              {materialTypes.map((materialType) => (
                <AddMaterial
                  type={capitalizeFirstLetter(materialType)}
                  newMaterialsState={newMaterialsState[materialType]}
                  materials={materials[materialType + "s"]}
                  handleAddMaterial={() => setAddMaterialType(materialType)}
                  showSelect={showSelect(materialType)}
                />
              ))}

              {!timeline && (
                <TimelineSelect
                  timeline={[
                    { unit: day, type: "Day", setUnit: setDay },
                    { unit: week, type: "Week", setUnit: setWeek },
                    { unit: month, type: "Month", setUnit: setMonth },
                    //////////////////Quarter //////////////////////////
                  ]}
                  titles={timelineTitles}
                  handleTimelineChange={handleTimelineChange}
                />
              )}
              <button
                className={styles.submit}
                onClick={(e) => submitHandler(e)}
              >
                Add Goal
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default AddGoalsScreen;
