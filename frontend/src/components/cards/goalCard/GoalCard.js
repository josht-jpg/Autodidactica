import { useEffect, useState } from "react";
import CompletionCheck from "./completionCheck/CompletionCheck";
import Header from "./header/Header";
import Materials from "./materials/Materials";
import Timeline from "./timeline/Timeline";

const materialTypes = ["projects", "resources", "exercises"];

const singularize = (text) => {
  const result = text.slice(0, -1);
  return result;
};

const GoalCard = ({ goal }) => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    let materialsInit = [];

    materialTypes.map((materialType) =>
      goal[materialType].map(
        (material) =>
          material &&
          materialsInit.push({
            image: material.imageSrc,
            title: material.title,
            type: singularize(materialType),
          })
      )
    );

    setMaterials(materialsInit);
  }, [goal]);

  return (
    <>
      <Header plan={goal.plan} />
      <Materials materials={materials} />

      <div style={{ alignSelf: "end", marginTop: "12px" }}>
        {goal.timelineUnit && <Timeline timeline={goal.timelineUnit} />}
        <CompletionCheck isComplete={goal.isComplete} />
      </div>
    </>
  );
};

export default GoalCard;
