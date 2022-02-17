import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import AddButton from "../button/AddButton";
import CardContainer from "../cards/cardContainer/CardContainer";
import styles from "./DropDown.module.scss";
import SmallNotes from "../notepad/SmallNotepad";
import InnerTimelineUnits from "../timeline/selectedTimelineUnit/InnerTimelineUnits";

const DropDown = ({
  items,
  isAddSelected,
  setIsAddSelected,
  handleSelect,
  isPreview,
  addMargin,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      className={`${styles.dropDown} ${isSelected && styles.animateDropDown}`}
      style={{ marginBottom: addMargin && "1.25rem" }}
    >
      <p
        className={styles.header}
        onClick={() => setIsSelected((prev) => !prev)}
      >
        {items.goals
          ? "Goals "
          : items.notes || items.notepad
          ? "Notes "
          : items.projects
          ? "Projects "
          : items.books
          ? "Books "
          : items.exercises
          ? "Exercises "
          : items.innerTimeline &&
            `Constituent ${
              items.innerTimeline.charAt(0).toUpperCase() +
              items.innerTimeline.slice(1)
            } `}
        {isSelected ? (
          <FaAngleUp className={styles.dropDownArrow} />
        ) : (
          <FaAngleDown className={styles.dropDownArrow} />
        )}
      </p>

      <div className={styles.itemsContainer}>
        {items.goals
          ? items.goals.map((goal) => (
              <CardContainer
                material={goal}
                materialType={"goal"}
                handleSelect={handleSelect}
              />
            ))
          : items.notes
          ? items.notes.map((notepad) => (
              <CardContainer
                material={notepad}
                materialType={"notepad"}
                handleSelect={handleSelect}
              />
            ))
          : items.notepad
          ? items.notepad[`${items.unitType.toLowerCase()}`] ===
              items.unitNumber && <SmallNotes notepad={items.notepad} />
          : items.projects
          ? items.projects.map((project) => (
              <CardContainer
                key={project && project._id}
                material={project}
                materialType={"project"}
                handleSelect={handleSelect}
              />
            ))
          : items.books
          ? items.books.map((book) => (
              <CardContainer
                key={book && book._id}
                material={book}
                materialType={"resource"}
                handleSelect={handleSelect}
              />
            ))
          : items.exercises
          ? items.exercises.map((exercise) => (
              <CardContainer
                key={exercise && exercise._id}
                material={exercise}
                materialType={"exercise"}
                handleSelect={handleSelect}
              />
            ))
          : items.innerTimelineUnits && (
              <InnerTimelineUnits
                innerUnits={items.innerTimelineUnits}
                type={items.timelineType}
                innerTimeline={items.innerTimeline}
                selectedItemWidth={items.selectedItemWidth}
                daysLength={items.daysLength}
              />
            )}
      </div>

      {isPreview &&
        ((items.goals && items.goals.length === 0) ||
          (items.notes && items.notes.length === 0)) && (
          <p className={styles.message}>
            {`No ${
              items.goals ? "goals" : items.notes && "notes"
            } at this time`}
          </p>
        )}

      {!isPreview && (items.goals || items.notes) && (
        <AddButton
          type={items.goals ? "Goal" : items.notes && "Notepad"}
          action={() => setIsAddSelected(true)}
          isVisible={isSelected || isAddSelected}
        />
      )}
    </div>
  );
};

export default DropDown;
