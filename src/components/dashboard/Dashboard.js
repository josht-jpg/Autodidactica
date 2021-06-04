import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../sidebar/SideBar";
import Loader from "../Loader";
import AddTimelineScreen from "../screens/addScreens/addTimelineScreen/AddTimelineScreen";
import TimelineUnit from "../timeline/timelineUnit/TimelineUnit";
import AddButton from "../button/AddButton";
import { getTimelineData } from "../../actions/timelineActions";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import styles from "./Dashboard.module.scss";
import useScreenSetup from "../../customHooks/useScreenSetup";
import useResizeHandler from "../../customHooks/useResizeHandler";
import useAuthResponse from "../../customHooks/useAuthResponse";

const Dashboard = ({ timelineType }) => {
  useAuthResponse();

  const { sidebarWidthState, isMinSidebarWidthState } = useScreenSetup();
  const [sidebarWidth] = sidebarWidthState;
  const [isMinSidebarWidth, setIsMinSidebarWidth] = isMinSidebarWidthState;

  const dispatch = useDispatch();
  const timelineScreen = useSelector((state) => state.timelineScreen);
  const { loading, units } = timelineScreen;

  const unitAlreadyExists = () =>
    units.map((unit) => unit.number).includes(addUnit.newUnit.number);

  const addNewSuperUnit = () =>
    !unitAlreadyExists() && units.push(addUnit.newUnit);

  const isRightSubunitType = () =>
    addUnit.unit && addUnit.unit.type === timelineType;

  const subunitAlreadyExists = (lastUnit) =>
    lastUnit[timelineType]
      .map((unit) => unit.number)
      .includes(addUnit.unit.number);

  const addNewSubunit = () => {
    const lastUnit = units.slice(-1)[0];

    isRightSubunitType() &&
      lastUnit[timelineType] &&
      !subunitAlreadyExists(lastUnit) &&
      lastUnit[timelineType].push(addUnit.unit);
  };

  const addNewUnit = () => {
    if (addUnit.newUnit) {
      addNewSuperUnit();
    } else if (units.slice(-1)) {
      addNewSubunit();
    }
  };

  const newUnit = (units, addUnit) => {
    const isNewUnitAdded = () => units && addUnit.unit;
    isNewUnitAdded() && addNewUnit();
  };

  const addUnit = useSelector((state) => state.addUnit);
  newUnit(units, addUnit);

  useEffect(() => {
    dispatch(getTimelineData(timelineType));
  }, [dispatch, timelineType]);

  const [showAddScreen, setShowAddScreen] = useState(false);

  const handleCloseAddScreen = () => {
    setShowAddScreen(false);
  };

  const lastSubunitDate = () => {
    const lastUnit = units.slice(-1);
    const lastSubunits = lastUnit[timelineType];
    const lastSubunit = lastSubunits.slice(-1);
    return lastSubunit.date;
  };

  const { width, selectedItemWidth } = useResizeHandler(
    setIsMinSidebarWidth,
    sidebarWidthState
  );

  const currentDate = () => units.length > 0 && lastSubunitDate();

  const subunitsLength = () => units.slice(-1)[timelineType].length;

  const currentUnitNumber = () => (units.length > 0 ? subunitsLength() + 1 : 1);

  const isLoading = () => loading || addUnit.loading;

  return (
    <div className={styles.container}>
      <div style={{ width: `${sidebarWidth}px` }}>
        <SideBar
          viewResolution={capitalizeFirstLetter(timelineType)}
          position={sidebarWidth}
          isMinWidth={isMinSidebarWidth}
        />
      </div>
      {isLoading() ? (
        <Loader style={{ justifySelf: "center", marginTop: "43vh" }} />
      ) : (
        <div style={{ width }}>
          {showAddScreen && (
            <AddTimelineScreen
              timelineUnit={capitalizeFirstLetter(timelineType).slice(0, -1)}
              handleCloseAddScreen={handleCloseAddScreen}
              width={selectedItemWidth}
              currentDate={currentDate()}
              number={currentUnitNumber()}
            />
          )}

          {units &&
            units.map((unit) => (
              <div style={{ display: "block", clear: "both" }}>
                <TimelineUnit
                  unit={unit}
                  timelineType={timelineType}
                  selectedItemWidth={selectedItemWidth}
                  isLastUnit={unit.number === units.length}
                />
              </div>
            ))}

          {units && units.length === 0 && (
            <AddButton
              type={`${capitalizeFirstLetter(timelineType).slice(0, -1)} 1`}
              isVisible={true}
              action={() => setShowAddScreen(true)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
