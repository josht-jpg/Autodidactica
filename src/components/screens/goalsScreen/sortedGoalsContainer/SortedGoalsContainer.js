import React from "react";
import CardContainer from "../../../cards/cardContainer/CardContainer";
import styles from "./SortedGoalsContainer.module.scss";

const SortedGoalsContainer = ({
  goals,
  header,
  goalsType,
  handleGoalSelect,
}) => {
  return (
    <>
      <div
        style={{
          margin: "2.75rem auto 0px auto",
        }}
      >
        <h3 className={styles.header}>{header}</h3>
        <hr
          className={styles.divider}
          style={{
            width: header && `${header.length * 11.5}px`,
          }}
        />
      </div>
      <div className={styles.goalsContainer}>
        {goals &&
          goals.map((goal) => (
            <CardContainer
              material={goal}
              materialType={"goal"}
              handleSelect={handleGoalSelect}
            />
          ))}
      </div>
    </>
  );
};

export default SortedGoalsContainer;
