import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FaTools } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { addProject } from "../../../../actions/projectActions";
import generateMongoId from "../../../../utils/generateMongoId";
import styles from "./AddProjectScreen.module.scss";
import sanitizeUrl from "../../../../utils/sanitizeLink";

const AddProjectScreen = ({ handleAddProject, handleCloseAddScreen }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [imageFile, setImageFile] = useState(false);

  const dispatch = useDispatch();

  const handleThumbnailFileChange = (file) => {
    setImageFile(file);
    setImageSrc("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    let _id = generateMongoId();

    // ?
    if (handleAddProject) {
      handleAddProject(
        title,
        imageFile ? URL.createObjectURL(imageFile) : imageSrc,
        _id
      );
    }

    dispatch(
      addProject(
        title,
        description,
        imageSrc && sanitizeUrl(imageSrc),
        imageFile,
        _id
      )
    );
    handleCloseAddScreen();
  };

  return (
    <div className={styles.form}>
      <h1>
        <FaTools />
      </h1>

      <div className={styles.inputContainer}>
        <label className={styles.label}>Project Name</label>
        <input
          className={styles.input}
          type="text"
          name="name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <label className={styles.thumbnailLabel}>Thumbnail (optional)</label>

      <div className={styles.thumbnailInputContainer}>
        <label
          className={styles.uploadButton}
          onChange={(e) =>
            handleThumbnailFileChange(e.target && e.target.files[0])
          }
        >
          <AiOutlineCloudUpload
            style={{
              fontSize: "1.3rem",
              marginRight: "0.5ch",
            }}
          />
          Select a file
          <input type="file" />
        </label>

        <h3 style={{ margin: "20px 6px auto 6px" }}>or</h3>

        <div>
          <label className={styles.linkLabel}>Embed Link</label>
          <input
            className={styles.linkInput}
            type="text"
            placeholder={!imageFile && "Image URL"}
            name="linkURL"
            value={imageSrc}
            disabled={imageFile}
            onChange={(e) => setImageSrc(e.target.value)}
          />
        </div>
      </div>

      {(imageFile || imageSrc) && (
        <div className={styles.thumbnailContainer}>
          <img
            className={styles.thumbnail}
            src={imageFile ? URL.createObjectURL(imageFile) : imageSrc}
            alt="Project Thumbnail"
          />
        </div>
      )}

      <div className={styles.inputContainer}>
        <label className={styles.label}>Description (optional)</label>
        <textarea
          className={styles.input}
          type="text"
          name="description"
          value={description}
          style={{ height: "80px", fontSize: "1.05rem", resize: "none" }}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button className={styles.submit} onClick={submitHandler}>
        Add Project
      </button>
    </div>
  );
};

export default AddProjectScreen;
