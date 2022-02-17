import React from "react";
import SortedGoalsContainer from "./sortedGoalsContainer/SortedGoalsContainer";
import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";

const timelineTypes = ["day", "week", "month", "quarter"];

const ListGoalsByTimeline = ({ goals, goalsType, handleGoalSelect }) => {
  const orderGoals = (timelineType) => {
    const sortGoalsByTimeline = () => {
      let result = {};

      for (const goal of goals) {
        const timelineNumber = goal[timelineType];
        if (timelineNumber) {
          if (result[timelineNumber]) {
            result[timelineNumber].push(goal);
          } else {
            result[timelineNumber] = [goal];
          }
        }
      }

      return result;
    };

    const createTimelineArray = (sortedGoals) => {
      let result = [];
      for (const [key, value] of Object.entries(sortedGoals)) {
        result.push({ number: key, goals: value });
      }

      return result;
    };

    const sortedGoals = sortGoalsByTimeline(timelineType);
    return createTimelineArray(sortedGoals);
  };

  const header = (timelineType, timelineNumber) =>
    `${capitalizeFirstLetter(timelineType)} ${timelineNumber}`;

  return timelineTypes.map((timelineType) =>
    orderGoals(timelineType).map(
      (orderedGoals, index) =>
        orderedGoals && (
          <SortedGoalsContainer
            key={`${goalsType}-${timelineType}-sorted-goals-${orderedGoals.number}-${index}`}
            goals={orderedGoals.goals}
            header={header(timelineType, orderedGoals.number)}
            goalsType={goalsType}
            handleGoalSelect={handleGoalSelect}
          />
        )
    )
  );
};

export default ListGoalsByTimeline;
