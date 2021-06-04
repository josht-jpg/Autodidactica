import React, { useState } from "react";
import Draggable from "react-draggable";
import MaterialCard from "../../cards/MaterialCard";
import styles from "./Draggable.module.scss";

const HiddenMaterial = ({
  material,
  materialType,
  index,
  globalDraggingState,
  handleEndGlobal,
}) => {
  const [isThisDragging, setIsThisDragging] = useState(false);

  const handleStart = () => {
    setIsThisDragging(true);
    globalDraggingState.setIsDragging(true);
    globalDraggingState.setDraggingIndex(index);
    globalDraggingState.setIsDraggingHidden(true);
  };

  const handleEnd = () => {
    globalDraggingState.setIsDragging(false);
    setIsThisDragging(false);
    handleEndGlobal();
  };

  const handleMouseLeave = () => {
    globalDraggingState.handleMouseLeave();
  };

  const minHeight = () => (materialType === "project" ? "152px" : "100px");

  const draggingStyles = {
    zIndex: "2",
    minHeight: minHeight(),
    transition: "none",
  };

  const stationaryStyles = {
    zIndex: "1002",
    minHeight: minHeight(),
  };

  return (
    material && (
      <Draggable
        onStart={handleStart}
        onStop={handleEnd}
        position={{ x: 0, y: 0 }}
      >
        <span
          className={styles.draggable}
          style={isThisDragging ? draggingStyles : stationaryStyles}
          onMouseLeave={() => handleMouseLeave()}
        >
          <MaterialCard material={material} materialType={materialType} />
        </span>
      </Draggable>
    )
  );
};

export default HiddenMaterial;
