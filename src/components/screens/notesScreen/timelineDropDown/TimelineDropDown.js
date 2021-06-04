import { useState } from "react";
import formatMaterialType from "../../../../utils/formatMaterialType";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import TimelineNotepadCard from "../../../cards/notepadCards/timelineNotepadCard/TimelineNotepadCard";
import styles from "./TimelineDropDown.module.scss";

const TimelineDropDown = ({ notes, timelineType, handleNotepadSelect }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      className={`${styles.dropDown} ${isSelected && styles.animateDropDown}`}
    >
      <p
        className={styles.header}
        onClick={() => setIsSelected((prev) => !prev)}
      >
        {formatMaterialType(timelineType) + " "}
        {isSelected ? (
          <FaAngleUp className={styles.dropDownArrow} />
        ) : (
          <FaAngleDown className={styles.dropDownArrow} />
        )}
      </p>
      <div className={styles.notesContainer}>
        {notes.map((notepad) => (
          <TimelineNotepadCard
            notepad={notepad}
            handleNotepadSelect={handleNotepadSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineDropDown;
