import { MAIN_BLUE } from "../../../constants/styleConstants";
import styles from "./TrashButtons.module.scss";

const trashTypes = [
  "All",
  "Projects",
  "Resources",
  "Exercises",
  "Notepads",
  "Goals",
];

const TrashButtons = ({ selectedTypeState }) => {
  const [selectedType, setSelectedType] = selectedTypeState;
  return (
    <div className={styles.container}>
      {trashTypes.map((trashType) => (
        <h3
          className={styles.button}
          style={{
            color: selectedType === trashType && MAIN_BLUE,
            textDecoration: selectedType === trashType && "underline",
          }}
          onClick={() => setSelectedType(trashType)}
        >
          {trashType}
        </h3>
      ))}
    </div>
  );
};

export default TrashButtons;
