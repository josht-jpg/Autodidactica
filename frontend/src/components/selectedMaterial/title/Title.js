import React, { useState } from "react";
import TextAreaAutosize from "react-textarea-autosize";
import styles from "./Title.module.scss";

const Title = ({ material, updateMaterialTitle, isEditMode }) => {
  const [titleState, setTitleState] = useState(material.title);

  const changeTitle = (e) => {
    material.title = e.target.value;

    updateMaterialTitle(e.target.value);
    setTitleState(e.target.value);
  };

  return (
    <div className={styles.container}>
      <h3 className={`${styles.textAreaHeader} fade-in`}>
        {isEditMode && "Title"}
      </h3>
      <div className={styles.titleContainer}>
        <TextAreaAutosize
          className={`${styles.title} scroll-bar`}
          style={{
            color: !isEditMode && "black",
            border: isEditMode ? "1px solid black" : "none",
            boxShadow: isEditMode ? "0 0 2px grey" : "none",
            borderRadius: isEditMode && "3px",
            minWidth: isEditMode && "100px",
          }}
          onChange={(e) => changeTitle(e)}
          value={titleState}
          disabled={!isEditMode}
        />
      </div>
      {!isEditMode && (
        <hr
          className={styles.ruler}
          style={{
            width: `${titleState ? titleState.length * 12 : 75}px`,
          }}
        />
      )}
    </div>
  );
};

export default Title;
