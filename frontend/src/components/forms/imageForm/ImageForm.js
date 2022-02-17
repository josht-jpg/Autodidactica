import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaAngleUp } from "react-icons/fa";
import styles from "./ImageForm.module.scss";

const ImageForm = ({
  handleImageSave,
  setIsImageArray,
  index,
  handleClose,
}) => {
  const [file, setFile] = useState(false);
  const [url, setUrl] = useState("");

  const handleUrlChange = (inputUrl) => {
    setUrl(inputUrl);

    inputUrl
      ? setIsImageArray((prev) => [
          ...prev.slice(0, index),
          "225px",
          ...prev.slice(index + 1),
        ])
      : setIsImageArray((prev) => [
          ...prev.slice(0, index),
          "110px",
          ...prev.slice(index + 1),
        ]);
  };

  const handleFileChange = (inputFile) => {
    setUrl("");
    setFile(inputFile);

    inputFile
      ? setIsImageArray((prev) => [
          ...prev.slice(0, index),
          "225px",
          ...prev.slice(index + 1),
        ])
      : setIsImageArray((prev) => [
          ...prev.slice(0, index),
          "110px",
          ...prev.slice(index + 1),
        ]);
  };

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
      <div
        className={styles.imageForm}
        style={{
          height: (url || file) && "200px",
          maxHeight: (url || file) && "200px",
        }}
      >
        <label
          className={styles.uploadButton}
          onChange={(e) => handleFileChange(e.target && e.target.files[0])}
        >
          <AiOutlineCloudUpload
            style={{ fontSize: "1.3rem", marginRight: "0.5ch" }}
          />
          Select a file
          <input type="file" />
        </label>

        <div style={{ marginTop: "10px" }}>or</div>
        <div style={{ marginTop: "2px" }}>
          <label className={styles.linkFormLabel}>Embed Link</label>
          <input
            className={styles.linkInput}
            type="text"
            placeholder={!file && "Image URL"}
            name="imageURL"
            value={url}
            disabled={file}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>
        {(url || file) && (
          <h3
            className={styles.saveButton}
            onClick={() => handleImageSave(url, file)}
          >
            Save
          </h3>
        )}
        <div
          className={styles.imageContainer}
          style={{
            maxHeight: url || file ? "80px" : "0px",
          }}
        >
          <img
            className={styles.image}
            src={url ? url : file && URL.createObjectURL(file)}
            alt="Upload"
          />
        </div>
      </div>
    </>
  );
};

export default ImageForm;
