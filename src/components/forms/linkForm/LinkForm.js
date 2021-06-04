import React, { useState } from "react";
import { FaLongArrowAltRight, FaAngleUp } from "react-icons/fa";
import styles from "./LinkForm.module.scss";

const LinkForm = ({ handleLinkSave, handleClose }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  return (
    <>
      <div
        className={`${styles.backButton} clickable`}
        onClick={() => {
          handleClose();
        }}
      >
        <FaAngleUp /> Close
      </div>
      <div className={styles.linkForm}>
        <div>
          <label className={styles.formLabel}>Title</label>
          <input
            className={styles.formInput}
            type="text"
            name="linkTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <FaLongArrowAltRight
          style={{ marginLeft: "10px", marginTop: "20px" }}
        />

        <div>
          <label className={styles.formLabel}>URL</label>
          <input
            className={styles.formInput}
            type="text"
            name="linkURL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <h3
          className={`${styles.saveButton} clickable`}
          onClick={() => handleLinkSave(title, url)}
        >
          Save
        </h3>
      </div>
    </>
  );
};

export default LinkForm;
