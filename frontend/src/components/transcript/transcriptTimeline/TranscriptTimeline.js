import React from "react";
import TimelineBlocks from "../timelineBlocks/TimelineBlocks";
import TimelineOptionButtons from "../timelineOptionButtons/TimelineOptionButtons";
import styles from "./TranscriptTimeline.module.scss";

const TranscriptTimeline = ({
  header,
  timeline,
  timelineRef,
  isEditMode,
  selectedTimelineType,
  changeSelectedTimeline,
  widthStyles,
  setDisplayHeader,
}) => {
  const handleSelect = (timelineType) => {
    changeSelectedTimeline(timelineType);
  };

  const timelineExists = () => timeline.types.length > 0;

  const showTimeline = () => timelineExists() || isEditMode;

  return (
    <div ref={timelineRef} className={styles.transcriptTimeline}>
      {showTimeline() && (
        <>
          {" "}
          <h1 className={styles.header}>{header}</h1>
          <hr
            style={{
              width: `${header && header.length * 15}px`,
              marginTop: "0px",
              marginBottom: "25px",
            }}
          />
          <TimelineOptionButtons
            timeline={timeline}
            selectedTimelineType={selectedTimelineType}
            handleSelect={handleSelect}
            timelineExists={timelineExists()}
          />
          <TimelineBlocks
            timeline={timeline}
            selectedTimelineType={selectedTimelineType}
            setDisplayHeader={setDisplayHeader}
            widthStyles={widthStyles}
          />
        </>
      )}
    </div>
  );
};

export default TranscriptTimeline;
