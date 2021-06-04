import CardContainer from "../../cards/cardContainer/CardContainer";

const SortByTimeCreated = ({ goals, sortBy, handleGoalSelect }) => {
  return (
    goals && (
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {(sortBy === "Newest to oldest" ? goals.slice().reverse() : goals).map(
          (goal) => (
            <CardContainer
              key={goal && goal._id}
              material={goal}
              materialType={"goal"}
              handleSelect={handleGoalSelect}
            />
          )
        )}
      </div>
    )
  );
};

export default SortByTimeCreated;
