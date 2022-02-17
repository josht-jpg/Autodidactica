import styles from "./GoalTimeline.module.scss";

const GoalTimeline = ({ goal, handleTimelineSelect }) => {
  return (
    <>
      <h3
        className={styles.header}
        onClick={() =>
          goal.day
            ? handleTimelineSelect("Day", goal.day)
            : goal.week
            ? handleTimelineSelect("Week", goal.week)
            : goal.month
            ? handleTimelineSelect("Month", goal.month)
            : goal.quarter && handleTimelineSelect("Quarter", goal.quarter)
        }
      >
        {goal.day
          ? `Day ${goal.day}`
          : goal.week
          ? `Week ${goal.week}`
          : goal.month
          ? `Month ${goal.month}`
          : goal.quarter && `Quarter ${goal.quarter}`}
      </h3>

      <hr
        className={styles.divider}
        style={{
          width: `${goal.plan ? goal.plan.length * 16 : 75}px`,
        }}
      />
    </>
  );
};

export default GoalTimeline;
