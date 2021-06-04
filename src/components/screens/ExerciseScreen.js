import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listExercises } from "../../actions/exerciseActions";
import SideBar from "../sidebar/SideBar";
import Loader from "../Loader";
import AddButton from "../button/AddButton";
import AddScreen from "./addScreens/addScreen/AddScreen";
import CardContainer from "../cards/cardContainer/CardContainer";
import SelectedMaterial from "../selectedMaterial/SelectedMaterial";
import useResizeHandler from "../../customHooks/useResizeHandler";
import useScreenSetup from "../../customHooks/useScreenSetup";
import styles from "./screen.module.scss";
import handleNewMaterialResponse from "../../utils/handleNewMaterialResponse";

const ExerciseScreen = () => {
  const { sidebarWidthState, isMinSidebarWidthState } = useScreenSetup();
  const [sidebarWidth] = sidebarWidthState;
  const [isMinSidebarWidth, setIsMinSidebarWidth] = isMinSidebarWidthState;

  const dispatch = useDispatch();

  const exercisesList = useSelector((state) => state.exerciseList);
  const { loading, exercises } = exercisesList;

  const addExercise = useSelector((state) => state.addExercise);
  addExercise && handleNewMaterialResponse(exercises, addExercise.exercise);

  const [isExerciseSelected, setIsExerciseSelected] = useState(false);
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    dispatch(listExercises());
  }, [dispatch]);

  const handleSelect = (exercise) => {
    setIsExerciseSelected(true);
    setSelectedExercise(exercise);
  };

  const handleUnselect = () => {
    setIsExerciseSelected(false);
  };

  const handleCloseAddScreen = async () => {
    setShowAddScreen(false);
  };

  const { width, selectedItemWidth } = useResizeHandler(
    setIsMinSidebarWidth,
    sidebarWidthState
  );

  return (
    <div className={styles.container}>
      <div style={{ width: `${sidebarWidth}px` }}>
        <SideBar
          itemSelected={"Exercises"}
          position={sidebarWidth}
          isMinWidth={isMinSidebarWidth}
        />
      </div>
      {loading || addExercise.loading ? (
        <Loader style={{ justifySelf: "center", marginTop: "43vh" }} />
      ) : (
        <div style={{ width }}>
          {showAddScreen && (
            <AddScreen
              type={"exercise"}
              width={selectedItemWidth}
              handleCloseAddScreen={handleCloseAddScreen}
            />
          )}
          {isExerciseSelected && (
            <SelectedMaterial
              type={"exercise"}
              unit={selectedExercise}
              handleUnselect={handleUnselect}
              dashboardWidth={selectedItemWidth}
            />
          )}

          <h2 className={styles.header}>Exercises</h2>

          <div className={styles.materialsContainer}>
            {exercises &&
              exercises.map((exercise) => (
                <CardContainer
                  key={exercise && exercise._id}
                  material={exercise}
                  materialType={"exercise"}
                  handleSelect={handleSelect}
                />
              ))}
          </div>

          <AddButton type="Exercise" action={() => setShowAddScreen(true)} />
        </div>
      )}
    </div>
  );
};

export default ExerciseScreen;
