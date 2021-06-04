import ExerciseCard from "./exerciseCard/ExerciseCard";
import GoalCard from "./goalCard/GoalCard";
import NotepadCard from "./notepadCard/NotepadCard";
import ProjectCard from "./projectCard/ProjectCard";
import ResourceCard from "./resourceCard/ResourceCard";

const MaterialCard = ({ material, materialType }) => {
  return materialType === "notepad" ? (
    <NotepadCard notepad={material} />
  ) : materialType === "resource" ? (
    <ResourceCard resource={material} />
  ) : materialType === "project" ? (
    <ProjectCard project={material} />
  ) : materialType === "exercise" ? (
    <ExerciseCard exercise={material} />
  ) : (
    (materialType === "goal" || materialType === "accomplishment") && (
      <GoalCard goal={material} />
    )
  );
};

export default MaterialCard;
