import React, { useState } from "react";
import { FaAngleUp } from "react-icons/fa";
import styles from "./VideoUrlForm.module.scss";

const VideoUrlForm = ({ handleVideoSave, handleClose }) => {
  const [url, setUrl] = useState("");

  return (
    <>
      <div
        className={styles.backButton}
        onClick={() => {
          handleClose();
        }}
      >
        <FaAngleUp /> Close
      </div>
      <div className={styles.videoUrlForm}>
        <h3 className={styles.urlPrompt}>Enter Url:</h3>
        <input
          className={styles.input}
          type="text"
          name="video-url"
          placeholder="Video link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <h3 className={styles.saveButton} onClick={() => handleVideoSave(url)}>
          Save
        </h3>
      </div>
    </>
  );
};

export default VideoUrlForm;
