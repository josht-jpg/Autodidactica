import { FaStickyNote } from "react-icons/fa";
import { MAIN_BLUE } from "../../../../constants/styleConstants";
import styles from "./GeneralNotepadCard.module.scss";

const GeneralNotepadCard = ({ notepad }) => {
  return (
    <div className={styles.GeneralNotepadCard}>
      <h1 className={styles.notepadName}>
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

export default GeneralNotepadCard;
