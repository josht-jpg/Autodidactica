import { FaAngleUp } from "react-icons/fa";
import styles from "./BackButton.module.scss";

const BackButton = ({ action }) => {
  return (
    <span className={styles.backButton} onClick={action}>
      <FaAngleUp /> Back
    </span>
  );
};

export default BackButton;
