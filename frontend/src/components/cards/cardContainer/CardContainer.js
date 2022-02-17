import MaterialCard from "../MaterialCard";
import styles from "./CardContainer.module.scss";

const CardContainer = ({ material, materialType, handleSelect }) => {
  const descriptionExists = () => material.description;
  const containerStyles =
    materialType === "project"
      ? {
          height: !descriptionExists() && "fit-content",
          minHeight: descriptionExists() && "152px",
        }
      : { minHeight: "100px" };

  return (
    material && (
      <span
        className={styles.cardContainer}
        style={containerStyles}
        onClick={() => handleSelect && handleSelect(material)}
      >
        {/* Revome material card as a component? -- or at least rename it. */}
        <MaterialCard material={material} materialType={materialType} />
      </span>
    )
  );
};

export default CardContainer;
