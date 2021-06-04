import React, { useState } from "react";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import { useDispatch } from "react-redux";
import { editText } from "../../../../actions/editablesActions";
import styles from "./EditNotepad.module.scss";

const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "image",
  "video",
  "file",
];

const EditNotepad = ({ element, materialId, isEditMode, type }) => {
  const modules = {
    syntax: false,
    toolbar: formats,
  };

  const [content, setContent] = useState(DOMPurify.sanitize(element.text));

  const dispatch = useDispatch();

  const onEditorChange = (value) => {
    dispatch(editText(value, element._id, materialId, type));
    element.updateText(value);
    setContent(value);
  };

  return (
    <div className={`${styles.container} ${!isEditMode && "preview-text"}`}>
      <div className="editorBlock">
        <ReactQuill
          theme={"snow"}
          onChange={(val) => onEditorChange(val)}
          modules={modules}
          value={content || ""}
          focus={true}
          readOnly={!isEditMode}
        />
      </div>
    </div>
  );
};

export default EditNotepad;
