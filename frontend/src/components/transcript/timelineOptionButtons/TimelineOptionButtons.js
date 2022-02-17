import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";
import styles from "./TimelineOptionButtons.module.scss";
import { MAIN_BLUE } from "../../../constants/styleConstants";

const TimelineOptionButtons = ({
  timeline,
  timelineExists,
  selectedTimelineType,
  handleSelect,
}) => {
  return (
    timelineExists && (
      <div className={styles.container}>
        {timeline.types.map((type) => (
          <h3
            className={styles.button}
            style={
              selectedTimelineType === type
                ? {
                    color: MAIN_BLUE,
                    textDecoration: "underline",
                  }
                : {}
            }
            onClick={() => handleSelect(type)}
          >
            {capitalizeFirstLetter(type)}
          </h3>
        ))}
      </div>
    )
  );
};

export default TimelineOptionButtons;
