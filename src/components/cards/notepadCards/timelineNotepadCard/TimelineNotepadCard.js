import { FaStickyNote } from "react-icons/fa";
import { MAIN_BLUE } from "../../../../constants/styleConstants";
import styles from "./TimelineNotepadCard.module.scss";

const TimelineNotepadCard = ({ notepad, handleNotepadSelect }) => {
  return (
    <div
      key={notepad && notepad._id}
      className={styles.timelineNotepadCard}
      onClick={() => handleNotepadSelect(notepad)}
    >
      <h1 className={styles.title}>
        <FaStickyNote
          style={{
            fontSize: "0.9rem",
            color: MAIN_BLUE,
          }}
        />{" "}
        {notepad.name}
      </h1>
    </div>
  );
};

export default TimelineNotepadCard;
