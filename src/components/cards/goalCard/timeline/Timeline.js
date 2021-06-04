import capitalizeFirstLetter from "../../../../utils/capitalizeFirstLetter";
import styles from "./Timeline.module.scss";

const Timeline = ({ timeline }) => {
  return (
    <h3 className={styles.timeline}>{`${capitalizeFirstLetter(timeline.type)} ${
      timeline.number
    }`}</h3>
  );
};

export default Timeline;
