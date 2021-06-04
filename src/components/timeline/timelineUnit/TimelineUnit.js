import React, { useState, useEffect } from "react";
import AddTimelineScreen from "../../screens/addScreens/addTimelineScreen/AddTimelineScreen";
import AddButton from "../../button/AddButton";
import TimelineBlock from "../timelineBlock/TimelineBlock";
import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";
import superUnit from "../../../utils/superUnit";
import styles from "./TimelineUnit.module.scss";
import SelectedTimelineUnit from "../selectedTimelineUnit/SelectedTimelineUnit";
import addBlankSubunits from "../../../utils/addBlankSubunits";

const TimelineUnit = ({
  unit,
  timelineType,
  selectedItemWidth,
  isLastUnit,
}) => {
  const [showAddScreen, setShowAddScreen] = useState(false);

  const handleCloseAddScreen = () => {
    setShowAddScreen(false);
  };

  const [subunits, setSubunits] = useState([]);

  useEffect(() => {
    setSubunits(addBlankSubunits(unit, timelineType));
  }, [unit, timelineType]);

  const [isUnitSelected, setIsUnitSelected] = useState(false);

  const handleUnitClose = () => {
    setIsUnitSelected(false);
  };

  const defaultTitle = () => superUnit(timelineType) + " " + unit.number;

  const lastSubunit = () => subunits && subunits.slice(-1)[0];

  const reformatTimelineTypeString = () =>
    capitalizeFirstLetter(timelineType).slice(0, -1);

  const addButtonMessage = () =>
    `${reformatTimelineTypeString()} ${
      lastSubunit() ? lastSubunit().number + 1 : 1
    }`;

  return (
    <React.Fragment key={unit._id}>
      {showAddScreen && (
        <AddTimelineScreen
          timelineUnit={reformatTimelineTypeString()}
          currentDate={lastSubunit() ? lastSubunit().date : new Date()}
          number={lastSubunit() ? lastSubunit().number + 1 : 1}
          handleCloseAddScreen={handleCloseAddScreen}
          width={selectedItemWidth}
        />
      )}

      {isUnitSelected && superUnit(timelineType) !== "Year" && (
        <SelectedTimelineUnit
          type={superUnit(timelineType)}
          unit={unit}
          handleClose={handleUnitClose}
          selectedItemWidth={selectedItemWidth}
        />
      )}
      <div>
        {subunits && subunits.length > 0 && (
          <>
            <h2
              className={styles.header}
              onClick={() => setIsUnitSelected(true)}
            >
              {unit.title ? unit.title : defaultTitle()}
            </h2>
            <hr
              className={styles.divider}
              style={{
                width: unit.title ? `${unit.title.length * 9}px` : "87px",
              }}
            />
          </>
        )}

        <div className={styles.unitsContainer}>
          {subunits &&
            subunits.map((subunit, index) => (
              <TimelineBlock
                type={reformatTimelineTypeString()}
                unit={subunit}
                selectedItemWidth={selectedItemWidth}
                isLastUnit={index === subunits.length - 1}
                isFirstUnit={index === 0}
              />
            ))}
        </div>

        {isLastUnit && (
          <AddButton
            type={addButtonMessage()}
            isVisible={!showAddScreen}
            action={() => setShowAddScreen(true)}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default TimelineUnit;
