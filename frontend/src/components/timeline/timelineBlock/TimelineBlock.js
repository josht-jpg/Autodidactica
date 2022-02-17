import React, { useState } from "react";
import SelectedTimelineUnit from "../selectedTimelineUnit/SelectedTimelineUnit";
import TimelineBlockItems from "./timelineBlockItems/TimelineBlockItems";
import createDateDisplay from "../../../utils/createDateDisplay";
import removeDuplicates from "../../../utils/removeDuplicates";
import styles from "./TimelineBlock.module.scss";
import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";

const items = ["goals", "projects", "books", "exercises"];

const TimelineBlock = ({
  unit,
  type,
  isFirstUnit,
  isLastUnit,
  fixedWidth,
  selectedItemWidth,
  setDisplayHeader,
}) => {
  items.map((item) => (unit[item] = removeDuplicates(unit[item])));

  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setDisplayHeader && setDisplayHeader(false);
    setIsSelected(true);
  };

  const handleUnselect = () => {
    setDisplayHeader && setDisplayHeader(true);
    setIsSelected(false);
  };

  const [isHover, setIsHover] = useState(false);

  return (
    <>
      {isSelected && (
        <SelectedTimelineUnit
          unit={unit}
          type={type}
          handleClose={handleUnselect}
          selectedItemWidth={selectedItemWidth}
        />
      )}

      {unit.isBlank ? (
        <span
          //key={`${unit && unit._id}-block`}
          className={styles.blank}
        >
          <h3 className={styles.blankHeader}>
            {createDateDisplay(unit.date, "Day")}
          </h3>
        </span>
      ) : (
        <span
          id={`block-${unit._id}`}
          className={`${styles[type.toLowerCase()]}  ${
            isFirstUnit && styles.leftEnd
          }
          ${isLastUnit && styles.rightEnd}
        }`}
          style={{
            width:
              fixedWidth && `${isHover ? fixedWidth * 0.94 : fixedWidth}vw`,
          }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={handleSelect}
        >
          <h2 className={styles.header}>
            {unit.title ? unit.title : type + " " + unit.number}
          </h2>
          <hr
            className={styles.divider}
            style={{
              width: unit.title ? `${unit.title.length * 9}px` : "50%",
            }}
          />
          <h3 className={styles.date}>{createDateDisplay(unit.date, type)}</h3>

          {items.map((item) => (
            <TimelineBlockItems
              items={unit[item]}
              type={capitalizeFirstLetter(item)}
            />
          ))}
        </span>
      )}
    </>
  );
};

export default TimelineBlock;
