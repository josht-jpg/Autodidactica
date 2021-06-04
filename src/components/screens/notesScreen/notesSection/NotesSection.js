import { useState } from "react";
import { FaAngleUp } from "react-icons/fa";
import capitalizeFirstLetter from "../../../../utils/capitalizeFirstLetter";
import AddButton from "../../../button/AddButton";
import NotepadCardSmall from "../notepadCardSmall/NotepadCardSmall";
import { timelineTypes } from "../../../../constants/timelineConstants";
import TimelineDropDown from "../timelineDropDown/TimelineDropDown";
import windowStyles from "../../../../styles/window/selectedWindow.module.scss";
import previewWindowStyles from "../../../../styles/window/previewWindow.module.scss";
import backButtonStyles from "../../../backButton/BackButton.module.scss";
import styles from "./NotesSection.module.scss";
import CardContainer from "../../../cards/cardContainer/CardContainer";

const NotesSection = ({
  notesType,
  notes,
  handleAddNotepad,
  handleNotepadSelect,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const notesExist = () =>
    notes.length > 0 || (notes.year && notes.year.length > 0);

  const convertNotesToArray = () => {
    let result = [];
    timelineTypes.map((t) => result.push(...notes[t]));
    return result;
  };

  const header = `${capitalizeFirstLetter(notesType)} Notes`;

  return isSelected ? (
    <div className={windowStyles.selectedWindow}>
      <span
        className={backButtonStyles.backButton}
        onClick={() => setIsSelected(false)}
      >
        <FaAngleUp /> Shrink
      </span>
      <h3 className={styles.header}>{header}</h3>
      <hr className={styles.divider} />

      {notesType === "timeline" ? (
        timelineTypes.map((timelineType) => (
          <TimelineDropDown
            timelineType={timelineType}
            notes={notes[timelineType]}
            handleNotepadSelect={handleNotepadSelect}
          ></TimelineDropDown>
        ))
      ) : (
        <div className={styles.notesContainer}>
          {notes.map((notepad) => (
            <CardContainer
              key={notepad && notepad._id}
              material={notepad}
              materialType={"notepad"}
              handleSelect={handleNotepadSelect}
            />
          ))}
        </div>
      )}

      {notesType !== "timeline" && (
        <AddButton type="Notepad" action={() => handleAddNotepad(notesType)} />
      )}
    </div>
  ) : (
    <div className={previewWindowStyles.windowContainer}>
      <h3 className={previewWindowStyles.header}>{header}</h3>
      <hr className={styles.divider} />
      <div
        className={previewWindowStyles.previewWindow}
        onClick={() => setIsSelected(true)}
      >
        <div className={previewWindowStyles.cardsContainer}>
          {notesExist() ? (
            (notesType === "timeline" ? convertNotesToArray() : notes).map(
              (notepad) => (
                <NotepadCardSmall
                  key={`notepad-card-small-${notepad && notepad._id}`}
                  notepad={notepad}
                />
              )
            )
          ) : (
            <p className={styles.header}>No notes yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
