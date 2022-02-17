import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import AddButton from "../../AddButton";
import Goal from "../../goal/Goal";

const Goals = ({
  goals,
  type,
  isAddGoalSelected,
  setIsAddGoalSelected,
  handleGoalSelect,
  isPreview,
}) => {
  const [isGoalsSelected, setIsGoalsSelected] = useState(false);

  return (
    <div
      className={`highlightDrop ${isGoalsSelected && "animateHighlightDrop"}`}
    >
      <p
        className="dropDownHeader clickable"
        style={{
          textAlign: "start",
          fontSize: "1.2rem",
          marginTop: "0.9vh",
        }}
        onClick={() => setIsGoalsSelected((prev) => !prev)}
      >
        Goals{" "}
        {isGoalsSelected ? (
          <FaAngleUp className="dropDownArrow" />
        ) : (
          <FaAngleDown className="dropDownArrow" />
        )}
      </p>

      {goals && goals.length > 0 ? (
        <>
          <div className="resource-card-row">
            {goals.map((goal) => (
              <Goal
                key={goal._id}
                goal={goal}
                isShowTimeline={true}
                type={type}
                handleGoalSelect={handleGoalSelect}
              />
            ))}
          </div>
        </>
      ) : (
        isPreview && (
          <p
            className="block-header"
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
            }}
          >
            {" "}
            No goals at this time
          </p>
        )
      )}

      {!isPreview && (
        <AddButton
          type="Goal"
          action={() => setIsAddGoalSelected(true)}
          isVisible={isGoalsSelected || isAddGoalSelected}
        />
      )}
    </div>
  );
};

export default Goals;
