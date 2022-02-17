import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TextAreaAutosize from "react-textarea-autosize";
import { editProjectDescription } from "../../../actions/projectActions";
import styles from "./Description.module.scss";

const Description = ({ material, updateMaterialDescription, isEditMode }) => {
  const [description, setDescription] = useState(material.description);

  const dispatch = useDispatch();

  const changeDescription = (e) => {
    setDescription(e.target.value);
    updateMaterialDescription(e.target.value);
    dispatch(editProjectDescription(e.target.value, material._id));
  };

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <h3 className={styles.editBoxHeader}>{isEditMode && "Description"}</h3>
      <p style={{ textAlign: "center", marginTop: "0" }}>
        <TextAreaAutosize
          className={styles.description}
          style={{
            color: !isEditMode && "black",
            border: isEditMode ? "1px solid black" : "none",
            boxShadow: isEditMode ? "0 0 2px grey" : "none",
            borderRadius: isEditMode && "3px",
            minWidth: isEditMode && "100px",
          }}
          onChange={(e) => changeDescription(e)}
          value={description}
          disabled={!isEditMode}
        />
      </p>
    </div>
  );
};

export default Description;
