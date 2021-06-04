import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listGoals } from "../../../actions/goalActions";
import SideBar from "../../sidebar/SideBar";
import Loader from "../../Loader";
import AddButton from "../../button/AddButton";
import AddGoalsScreen from "../addScreens/addGoalScreen/AddGoalsScreen";
import GoalsSectionWindow from "./goalsSectionWindow/GoalsSectionWindow";
import SelectedGoal from "../../selectedGoal/SelectedGoal";
import styles from "../windowLayout.module.scss";
import useResizeHandler from "../../../customHooks/useResizeHandler";
import useScreenSetup from "../../../customHooks/useScreenSetup";

const goalTypes = ["Resource", "Project", "Exercise"];
const reformatGoalType = (type) => type.toLowerCase() + "s";

const GoalsScreen = () => {
  const { sidebarWidthState, isMinSidebarWidthState } = useScreenSetup();
  const [sidebarWidth] = sidebarWidthState;
  const [isMinSidebarWidth, setIsMinSidebarWidth] = isMinSidebarWidthState;

  const dispatch = useDispatch();

  const goalList = useSelector((state) => state.goalList);
  const { loading, goals } = goalList;

  useEffect(() => {
    dispatch(listGoals());
  }, [dispatch]);

  const filterGoals = (goalType) =>
    goals &&
    goals.filter((goal) => goal[reformatGoalType(goalType)].length > 0);

  const [isGoalSelected, setIsGoalSelected] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setIsGoalSelected(true);
  };

  const handleClose = () => {
    setIsGoalSelected(false);
  };

  const [isAddScreenSelected, setIsAddScreenSelected] = useState(false);

  const { width, selectedItemWidth } = useResizeHandler(
    setIsMinSidebarWidth,
    sidebarWidthState
  );

  return (
    <div className={styles.dashboard}>
      <div style={{ width: `${sidebarWidth}px` }}>
        <SideBar
          itemSelected={"Goals"}
          position={sidebarWidth}
          isMinWidth={isMinSidebarWidth}
        />
      </div>

      {isAddScreenSelected && (
        <AddGoalsScreen
          type={"book"}
          handleCloseAddScreen={() => setIsAddScreenSelected(false)}
          width={selectedItemWidth}
        />
      )}

      {loading ? (
        <Loader style={{ justifySelf: "center", marginTop: "43vh" }} />
      ) : (
        <div style={{ width }}>
          {isGoalSelected && (
            <SelectedGoal
              goal={selectedGoal}
              handleClose={handleClose}
              left={`${sidebarWidth + 35}px`} //?
              goalWidth={selectedItemWidth}
            />
          )}

          <h2 className={styles.header}>Goals</h2>

          <div className={styles.windowsContainer}>
            {goalTypes.map((goalType) => (
              <GoalsSectionWindow
                goalsType={goalType}
                goals={filterGoals(goalType)}
                handleGoalSelect={handleGoalSelect}
              />
            ))}
          </div>
          <div style={{ marginTop: "3.75rem" }}>
            <AddButton
              type="Goal"
              action={() => setIsAddScreenSelected(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsScreen;
