import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listNotes } from "../../../actions/notepadActions";
import SideBar from "../../sidebar/SideBar";
import Notepad from "../../notepad/Notepad";
import Loader from "../../Loader";
import AddNotepadScreen from "../addScreens/addNotepadScreen/AddNotePadScreen";
import styles from "../windowLayout.module.scss";
import NotesSection from "./notesSection/NotesSection";
import { timelineTypes } from "../../../constants/timelineConstants";
import handleNewMaterialResponse from "../../../utils/handleNewMaterialResponse";
import useScreenSetup from "../../../customHooks/useScreenSetup";
import useResizeHandler from "../../../customHooks/useResizeHandler";

const notepadTypes = ["resource", "project", "exercise", "timeline"];

const NotesScreen = () => {
  const { sidebarWidthState, isMinSidebarWidthState } = useScreenSetup();
  const [sidebarWidth] = sidebarWidthState;
  const [isMinSidebarWidth, setIsMinSidebarWidth] = isMinSidebarWidthState;

  const dispatch = useDispatch();

  const notesList = useSelector((state) => state.notesList);
  const { loading, notes } = notesList;

  useEffect(() => {
    dispatch(listNotes());
  }, [dispatch]);

  const filterTimelineNotes = () => {
    let result = {};
    timelineTypes.map((t) => (result[t] = notes.filter((n) => n && n[t])));
    return result;
  };
  const filterNotes = (type) =>
    type === "timeline"
      ? filterTimelineNotes()
      : notes.filter((n) => n && n[type]);

  const addNotepad = useSelector((state) => state.addNotepad);
  handleNewMaterialResponse(notes, addNotepad.notes);

  const [isNotepadSelected, setIsNotepadSelected] = useState(false);
  const [seleectedNotepad, setSelectedNotepad] = useState(null);

  const handleNotepadSelect = async (notepad) => {
    setSelectedNotepad(notepad);
    setIsNotepadSelected(true);
  };

  const handleClose = () => {
    setIsNotepadSelected(false);
  };

  const [isAddNotepadSelected, setIsAddNotepadSelected] = useState(false);
  const [addType, setAddType] = useState(false);
  const handleAddNotepad = (type) => {
    setAddType(type);
    setIsAddNotepadSelected(true);
  };
  const handleCloseAddScreen = () => {
    setIsAddNotepadSelected(false);
    setAddType(false);
  };

  const { width, selectedItemWidth } = useResizeHandler(
    setIsMinSidebarWidth,
    sidebarWidthState
  );

  return (
    <div className={styles.dashboard}>
      <div style={{ width: `${sidebarWidth}px` }}>
        <SideBar
          itemSelected={"Notes"}
          position={sidebarWidth}
          isMinWidth={isMinSidebarWidth}
        />
      </div>

      {loading || addNotepad.loading ? (
        <Loader style={{ justifySelf: "center", marginTop: "43vh" }} />
      ) : (
        <div style={{ width }}>
          {isNotepadSelected && (
            <Notepad
              notepad={seleectedNotepad}
              notepadWidth={selectedItemWidth}
              handleClose={handleClose}
            />
          )}

          {isAddNotepadSelected && (
            <AddNotepadScreen
              type={addType}
              dashboardWidth={selectedItemWidth}
              handleClose={handleCloseAddScreen}
            />
          )}

          <h2 className={styles.header}>Notes</h2>

          <div className={styles.windowsContainer}>
            {notepadTypes.map((notepadType) => (
              <NotesSection
                notesType={notepadType}
                notes={filterNotes(notepadType)}
                handleAddNotepad={handleAddNotepad}
                handleNotepadSelect={handleNotepadSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesScreen;
