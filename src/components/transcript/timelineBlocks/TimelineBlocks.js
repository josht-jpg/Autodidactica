import { useState } from "react";
import TimelineBlock from "../../timeline/timelineBlock/TimelineBlock";
import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";
import styles from "./TimelineBlocks.module.scss";

const reformatType = (type) => capitalizeFirstLetter(type.slice(0, -1));

const TimelineBlocks = ({
  timeline,
  selectedTimelineType,
  setDisplayHeader,
  widthStyles,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollPositionRight, setScrollPositionRight] = useState(10000);

  const handleScroll = () => {
    setScrollPosition(
      document.getElementById("position") &&
        document.getElementById("position").scrollLeft
    );
    setScrollPositionRight(
      document.getElementById("position") &&
        Math.abs(
          document.getElementById("position").clientWidth -
            document.getElementById("position").scrollWidth
        ) - scrollPosition
    );
  };

  const fadeHeight =
    selectedTimelineType === "days" ? "calc(38vh + 10px)" : "calc(50vh + 10px)";

  return (
    <div id="timeline-container" className={styles.container}>
      <div
        id="position"
        className={styles.scrollContainer}
        onScroll={handleScroll}
      >
        <div
          className={styles.fadeLeft}
          style={{
            width: `${scrollPosition * 1.5}px`,
            height: fadeHeight,
            maxHeight: selectedTimelineType === "days" ? "410px" : "459px",
          }}
        />
        <div
          className={styles.blocksContainer}
          style={{
            paddingRight:
              selectedTimelineType === "days" &&
              timeline[selectedTimelineType].length > 6 &&
              "5px",
            paddingLeft:
              selectedTimelineType === "days" &&
              timeline[selectedTimelineType].length > 6 &&
              "5px",
          }}
        >
          {timeline[selectedTimelineType]
            .sort((a, b) =>
              a.number > b.number ? 1 : b.number > a.number ? -1 : 0
            )
            .map(
              (timelineUnit, index) =>
                timelineUnit.goals && (
                  <TimelineBlock
                    key={timelineUnit && `${timelineUnit._id}-block`}
                    index={index}
                    unit={timelineUnit}
                    type={reformatType(selectedTimelineType)}
                    fixedWidth={selectedTimelineType === "days" && "10.75"}
                    setDisplayHeader={setDisplayHeader}
                    isFirstUnit={index === 0}
                    isLastUnit={
                      index === timeline[selectedTimelineType].length - 1
                    }
                    selectedItemWidth={widthStyles.selectedItemWidth}
                  />
                )
            )}
        </div>
      </div>
      <div
        className={styles.fadeRight}
        style={{
          width: `${scrollPositionRight}px`,
          height: fadeHeight,
          maxHeight: selectedTimelineType === "days" ? "410px" : "459px",
          right: `calc(7.25% - ${widthStyles.sidebarWidth / 8}px)`,
        }}
      />
    </div>
  );
};

export default TimelineBlocks;
