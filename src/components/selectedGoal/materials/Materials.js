import MaterialSection from "../materialSection/MaterialSection";
import styles from "./Materials.module.scss";
import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";

const materialTypes = ["project", "resource", "exercise"];

const Materials = ({ goal, handleMaterialSelect, isEditMode }) => {
  const showHeader = (materialType) => {
    switch (materialType) {
      case "project":
        return (
          goal.projects.length > 0 &&
          (goal.resources.length > 0 || goal.exercises.length > 0)
        );
      case "resource":
        return (
          goal.resources.length > 0 &&
          (goal.projects.length > 0 || goal.exercises.length > 0)
        );
      case "exercise":
        return (
          goal.exercises.length > 0 &&
          (goal.resources.length > 0 || goal.projects.length > 0)
        );
      default:
        return false;
    }
  };

  return materialTypes.map((materialType) => (
    <>
      {showHeader(materialType) && (
        <>
          <h3 className={styles.sectionHeader}>
            {capitalizeFirstLetter(materialType) + "s"}
          </h3>
          <hr className={styles.ruler} />
        </>
      )}
      <MaterialSection
        materials={goal[materialType + "s"]}
        type={materialType}
        handleSelect={handleMaterialSelect}
        isEditMode={isEditMode}
      />
    </>
  ));
};

export default Materials;
