import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import { updateNotepad } from "../../actions/notepadActions";
import styles from "./Notepad.module.scss";
import "react-quill/dist/quill.snow.css";

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
  "video",
  "blockquote",
  "clean",
];

const SmallNotepad = ({ notepad }) => {
  const isPreview = JSON.parse(sessionStorage.getItem("isPreview"));
  const dispatch = useDispatch();

  const [content, setContent] = useState(DOMPurify.sanitize(notepad.notes));

  const onEditorChange = (newNotes) => {
    dispatch(updateNotepad(newNotes, notepad._id));
    setContent(newNotes);
    notepad.notes = newNotes;
  };

  return (
    Object.keys(notepad).length !== 0 && (
      <>
        <div
          className={`${styles.timelineEditor} ${
            isPreview && styles.previewEditor
          }`}
        >
          <div>
            <div id="toolbar" style={{ display: isPreview && "none" }}>
              <select
                className="ql-header"
                defaultValue={""}
                onChange={(e) => e.persist()}
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
              <button className="ql-video" />
              <button className="ql-blockquote" />
            </div>
            <ReactQuill
              theme={"snow"}
              onChange={(val) => onEditorChange(val)}
              modules={modules}
              formats={formats}
              value={content || ""}
              style={{ height: "55vh" }}
              readOnly={isPreview}
              placeholder={""}
            />
          </div>
        </div>
      </>
    )
  );
};

export default SmallNotepad;
