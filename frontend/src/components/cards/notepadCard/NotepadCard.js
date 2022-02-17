import ExerciseNotepadCard from "../notepadCards/exerciseNotepadCard/ExerciseNotepadCard";
import GeneralNotepadCard from "../notepadCards/generalNotepadCard/GeneralNotepadCard";
import ProjectNotepadCard from "../notepadCards/projectNotepadCard/ProjectNotepadCard";
import ResourceNotepadCard from "../notepadCards/resourceNotepadCard/ResourceNotepadCard";

const NotepadCard = ({ notepad }) => {
  return notepad.exercise ? (
    <ExerciseNotepadCard notepad={notepad} />
  ) : notepad.project ? (
    <ProjectNotepadCard notepad={notepad} />
  ) : notepad.resource ? (
    <ResourceNotepadCard notepad={notepad} />
  ) : (
    <GeneralNotepadCard notepad={notepad} />
  );
};

export default NotepadCard;
