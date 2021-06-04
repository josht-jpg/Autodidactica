import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import SmallGoalCard from "../../../cards/smallGoalCard/SmallGoalCard";
import ListGoalsByTimeline from "../ListGoalsByTimeline";
import ListGoalsByTitle from "../ListGoalsByTitle";
import SortByTimeCreated from "../SortByTimeCreated";
import styles from "./GoalsSectionWindow.module.scss";

const sortByOptions = [
  "Timeline",
  "Title",
  "Newest to oldest",
  "Oldest to newest",
];

const GoalsSectionWindow = ({ goalsType, goals, handleGoalSelect }) => {
  const [isSelected, setIsSelected] = useState(false);

  const [showSortByOptions, setShowSortByOptions] = useState(false);
  const [sortBy, setSortBy] = useState(sortByOptions[0]);

  return isSelected ? (
    <div className={styles.selectedWindow}>
      <span
        className={styles.shrinkButton}
        onClick={() => setIsSelected(false)}
      >
        <FaAngleUp /> Shrink
      </span>
      <h3 className={styles.header}>{`${goalsType} Related Goals`}</h3>
      <hr className={styles.divider} />

      <div className={styles.sortContainer}>
        Sort By:{" "}
        <span
          className={styles.clickable}
          onClick={() => setShowSortByOptions((prev) => !prev)}
        >
          {sortBy} <FaAngleDown />
        </span>
        {showSortByOptions &&
          sortByOptions.map((option, index) => (
            <div
              key={`goal-drop-down-${index}`}
              className={styles.sortOption}
              onClick={() => {
                setSortBy(option);
                setShowSortByOptions(false);
              }}
            >
              {option}
            </div>
          ))}
      </div>

      {sortBy === "Timeline" ? (
        <ListGoalsByTimeline
          goals={goals}
          goalsType={goalsType}
          handleGoalSelect={handleGoalSelect}
        />
      ) : sortBy === "Title" ? (
        <ListGoalsByTitle
          goals={goals}
          goalsType={goalsType}
          handleGoalSelect={handleGoalSelect}
        />
      ) : (
        <SortByTimeCreated
          goals={goals}
          goalsType={goalsType}
          sortBy={sortBy}
          handleGoalSelect={handleGoalSelect}
        />
      )}
    </div>
  ) : (
    <div className={styles.previewWindowContainer}>
      <h3 className={styles.previewWindowHeader}>
        {`${goalsType} Related Goals`}
      </h3>

      <div className={styles.previewWindow} onClick={() => setIsSelected(true)}>
        <div className={styles.previewGoalsContainer}>
          {goals.length > 0 ? (
            goals.map((goal) => (
              <SmallGoalCard
                key={`small-goal-card${goal._id}`}
                goal={goal}
                type={
                  goalsType === "Resource" ? "book" : goalsType.toLowerCase()
                }
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>No Goals Yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsSectionWindow;
