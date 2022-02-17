import React from "react";
import SortedGoalsContainer from "./sortedGoalsContainer/SortedGoalsContainer";

const formatGoalsType = (goalsType) => goalsType.toLowerCase() + "s";

const ListGoalsByTitle = ({ goals, goalsType, handleGoalSelect }) => {
  goalsType = formatGoalsType(goalsType);

  const sortGoals = () => {
    const sortGoalsByTitle = () => {
      let result = {};

      for (const goal of goals) {
        goal &&
          goal[goalsType].map((material) => {
            if (material) {
              if (result[material.title]) {
                result[material.title].push(goal);
              } else {
                result[material.title] = [goal];
              }
            }
          });
      }

      return result;
    };

    const convertToArray = (sortedGoals) => {
      let result = [];
      for (const [key, value] of Object.entries(sortedGoals)) {
        result.push({ title: key, goals: value });
      }
      return result;
    };

    const sortedGoals = sortGoalsByTitle();
    return convertToArray(sortedGoals);
  };

  return sortGoals().map(
    (titleGoals, index) =>
      titleGoals && (
        <SortedGoalsContainer
          key={`${goalsType}-sorted-goals-${titleGoals.title}-${index}`}
          goals={titleGoals.goals}
          header={titleGoals.title}
          goalsType={goalsType}
          handleGoalSelect={handleGoalSelect}
        />
      )
  );
};

export default ListGoalsByTitle;
