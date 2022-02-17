import CardContainer from "../../cards/cardContainer/CardContainer";
import styles from "./Subgoals.module.scss";

const Subgoals = ({ subgoals, handleSubgoalSelect, isEditMode }) => {
  return (
    <>
      {(isEditMode || subgoals.length > 0) && (
        <h3 className={styles.header}>Subgoals</h3>
      )}
      <div className={styles.container}>
        {subgoals.map((subgoal) => (
          <CardContainer
            key={subgoal && subgoal._id}
            material={subgoal}
            materialType={"goal"}
            handleSelect={handleSubgoalSelect}
          />
        ))}
      </div>
    </>
  );
};

export default Subgoals;
