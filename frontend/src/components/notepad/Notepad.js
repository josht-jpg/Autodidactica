import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TextAreaAutosize from "react-textarea-autosize";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill";
import {
  editNotepadTitle,
  removeNotepad,
  updateNotepad,
} from "../../actions/notepadActions";
import SelectedMaterial from "../selectedMaterial/SelectedMaterial";
import NotepadMaterial from "./notepadMaterial/NotepadMaterial";
import styles from "./Notepad.module.scss";
import BackButton from "../backButton/BackButton";
import Options from "../options/Options";
import OptionsButton from "../optionsButton/OptionsButton";

const modules = {
  syntax: false,

  toolbar: {
    container: "#toolbar",
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "image",
  "video",
  "file",
  "link",
  "code-block",
  "blockquote",
  "clean",
];

const Notepad = ({ notepad, notepadWidth, handleClose }) => {
  const isPreview = JSON.parse(sessionStorage.getItem("isPreview"));
  const dispatch = useDispatch();

  const [content, setContent] = useState(DOMPurify.sanitize(notepad.notes));

  const materialType = notepad.project
    ? "project"
    : notepad.resource
    ? "resource"
    : notepad.exercise && "exercise";

  const [isMaterialSelected, setIsMaterialSelected] = useState(false);
  const handleMaterialSelect = () => setIsMaterialSelected(true);

  const onEditorChange = (value) => {
    dispatch(updateNotepad(value, notepad._id));
    setContent(value);
    notepad.notes = value;
  };

  const [isOptionsSelected, setIsOptionsSelected] = useState(false);
  const [isTitleEdit, setIsTitleEdit] = useState(false);

  const [titleState, setTitleState] = useState(notepad.name);

  const handleOptionsSelect = () => {
    setIsOptionsSelected((prev) => !prev);
  };
  const handleOptionsClose = () => {
    setIsOptionsSelected(false);
  };

  const changeTitle = (e) => {
    dispatch(editNotepadTitle(e.target.value, notepad._id));
    setTitleState(e.target.value);
    notepad.name = e.target.value;
  };

  const handleDelete = () => {
    dispatch(removeNotepad(notepad._id));
    window.location.reload();
  };

  return (
    <>
      {isMaterialSelected && (
        <SelectedMaterial
          type={materialType}
          unit={notepad[materialType]}
          handleUnselect={() => setIsMaterialSelected(false)}
          dashboardWidth={notepadWidth}
        />
      )}

      <div
        className={styles.notepad}
        style={{
          width: notepadWidth,
        }}
      >
        <BackButton action={handleClose} />
        <OptionsButton action={handleOptionsSelect} isPreview={isPreview} />

        {isOptionsSelected && (
          <Options
            type={"notepad"}
            editMessage={"Title"}
            isEditMode={isTitleEdit}
            eventHandlers={{
              handleEditPreviewSwitch: () => setIsTitleEdit((prev) => !prev),
              handleDelete,
              handleOptionsClose,
            }}
          />
        )}

        {notepad.name || isTitleEdit ? (
          <div className={styles.titleContainer}>
            <TextAreaAutosize
              className={styles.title}
              style={{
                border: isTitleEdit ? "1px solid black" : "none",
                boxShadow: isTitleEdit ? "0 0 2px grey" : "none",
                borderRadius: isTitleEdit && "3px",
                minWidth: isTitleEdit && "100px",
              }}
              onChange={(e) => changeTitle(e)}
              value={titleState}
              disabled={!isTitleEdit}
            />
          </div>
        ) : (
          <div>
            <h2 className={styles.defaultHeader}>Notepad</h2>
          </div>
        )}

        {!isTitleEdit && (
          <hr
            className={styles.divider}
            style={{
              width: notepad.name ? `${notepad.name.length * 12}px` : "100px",
            }}
          />
        )}

        {notepad[materialType] && (
          <NotepadMaterial
            material={notepad[materialType]}
            materialType={materialType}
            handleSelect={handleMaterialSelect}
          />
        )}

        <div
          className={`${styles.editor} ${isPreview && styles.previewEditor}`}
        >
          <div>
            <div id="toolbar" style={{ display: isPreview && "none" }}>
              <select
                className="ql-header"
                defaultValue={""}
                onChange={(e) => e.persist()}
                style={{ marginLeft: "0px" }}
              >
                <option value="1" />
                <option value="2" />
                <option value="" />
              </select>
              <button className="ql-bold" style={{ marginLeft: "35px" }} />
              <button className="ql-italic" />
              <button className="ql-underline" />
              <button className="ql-strike" />
              <button className="ql-code-block" />
              <button className="ql-image" />
              <button className="ql-video" />
              <button className="ql-blockquote" />
            </div>

            <ReactQuill
              theme={"snow"}
              onChange={(val) => onEditorChange(val)}
              modules={modules}
              formats={formats}
              value={content || ""}
              readOnly={isPreview}
              placeholder={""}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Notepad;
