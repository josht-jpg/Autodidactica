import { GoKebabHorizontal } from "react-icons/go";
import styles from "./OptionsButton.module.scss";

const OptionsButton = ({ action, isPreview }) => {
  return (
    !isPreview && (
      <span className={styles.optionsButton} onClick={action}>
        <GoKebabHorizontal className={styles.icon} />
      </span>
    )
  );
};

export default OptionsButton;
