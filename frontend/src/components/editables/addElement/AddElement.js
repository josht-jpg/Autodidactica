import React, { useState } from "react";
import { FaMinus, FaLink, FaVideo } from "react-icons/fa";
import { BiText } from "react-icons/bi";
import { AiOutlineCamera } from "react-icons/ai";
import mongoose from "mongoose";
import { useDispatch } from "react-redux";
import {
  insertText,
  insertVideo,
  insertLink,
  insertDivider,
  insertImage,
} from "../../../actions/editablesActions";
import VideoUrlForm from "../../forms/videoUrlForm/VideoUrlForm";
import LinkForm from "../../forms/linkForm/LinkForm";
import ImageForm from "../../forms/imageForm/ImageForm";
import styles from "./AddElement.module.scss";

const AddElement = ({
  handleAddElement,
  setIsEditArray,
  setIsImageArray,
  index,
  materialId,
  isAddSubjectScreen,
  type,
}) => {
  const hanldeAddHover = (e) => {
    if (isClicked) {
      e.target.title = "Close";
    } else {
      e.target.title = "Insert";
    }
  };

  const dispatch = useDispatch();

  const handleTextHover = (e) => {
    e.target.title = "Text";
  };

  const handleTextClick = () => {
    let elementId = mongoose.Types.ObjectId();
    dispatch(insertText(index, materialId, elementId, type));
    setIsClicked(false);

    let newElement = { type: "TEXT", text: "", _id: elementId };
    handleAddElement(newElement, index);

    setIsEditArray((prev) => [
      ...prev.slice(0, index),
      true,
      ...prev.slice(index),
    ]);
  };

  const [isVideoClicked, setIsVideoClicked] = useState(false);

  const handleVideoClick = () => {
    setIsClicked(false);
    setIsVideoClicked(true);
  };

  const handleVideoSave = (url) => {
    let elementId = mongoose.Types.ObjectId();
    dispatch(insertVideo(index, url, materialId, elementId, type));
    let newElement = { type: "VIDEO", url, _id: elementId };
    handleAddElement(newElement, index);

    setIsEditArray((prev) => [
      ...prev.slice(0, index),
      true,
      ...prev.slice(index),
    ]);
    setIsVideoClicked(false);
  };

  const handleVideoClose = () => {
    setIsVideoClicked(false);
    setIsEditArray((prev) => [
      ...prev.slice(0, index),
      false,
      ...prev.slice(index + 1),
    ]);
  };

  const [isImageClicked, setIsImageClicked] = useState(false);

  const handleImageClick = () => {
    setIsImageArray((prev) => [
      ...prev.slice(0, index),
      "110px",
      ...prev.slice(index + 1),
    ]);
    setIsClicked(false);
    setIsImageClicked(true);
  };

  const handleImageSave = (url, file) => {
    let elementId = mongoose.Types.ObjectId();
    dispatch(insertImage(index, url, file, materialId, elementId, type));
    let newElement = {
      type: "IMAGE",
      url: file ? { isUploaded: true, file: URL.createObjectURL(file) } : url,
      _id: elementId,
    };
    handleAddElement(newElement, index);

    setIsEditArray((prev) => [
      ...prev.slice(0, index),
      true,
      ...prev.slice(index),
    ]);
    setIsImageArray((prev) => [
      ...prev.slice(0, index),
      false,
      ...prev.slice(index + 1),
    ]);
    setIsImageClicked(false);
  };

  const handleImageClose = () => {
    setIsImageArray((prev) => [
      ...prev.slice(0, index),
      false,
      ...prev.slice(index + 1),
    ]);
    setIsEditArray((prev) => [
      ...prev.slice(0, index),
      false,
      ...prev.slice(index + 1),
    ]);
    setIsImageClicked(false);
  };

  const [isLinkClicked, setIsLinkClicked] = useState(false);

  const handleLinkClick = () => {
    setIsClicked(false);
    setIsLinkClicked(true);
  };

  const handleLinkSave = (title, url) => {
    let elementId = mongoose.Types.ObjectId();
    dispatch(insertLink(index, title, url, materialId, elementId, type));
    let newElement = { type: "LINK", title, url, _id: elementId };
    handleAddElement(newElement, index);

    setIsEditArray((prev) => [
      ...prev.slice(0, index),
      true,
      ...prev.slice(index),
    ]);
    setIsLinkClicked(false);
  };

  const handleLinkClose = () => {
    setIsLinkClicked(false);
    setIsEditArray((prev) => [
      ...prev.slice(0, index),
      false,
      ...prev.slice(index + 1),
    ]);
  };

  const handleDividerClick = () => {
    let elementId = mongoose.Types.ObjectId();
    dispatch(insertDivider(index, materialId, elementId, type));
    setIsClicked(false);

    let newElement = { type: "DIVIDER", _id: elementId };
    handleAddElement(newElement, index);

    setIsEditArray((prev) => [
      ...prev.slice(0, index),
      true,
      ...prev.slice(index),
    ]);
  };

  const handlePhotoHover = (e) => {
    e.target.title = "Photo";
  };
  const handleVideoHover = (e) => {
    e.target.title = "Video";
  };
  const handleLinkHover = (e) => {
    e.target.title = "Link";
  };
  const handleDividerHover = (e) => {
    e.target.title = "Divider";
  };

  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    setIsEditArray((prev) => [
      ...prev.slice(0, index),
      !isClicked,
      ...prev.slice(index + 1),
    ]);
    setIsClicked((prev) => !prev);
  };

  return isVideoClicked ? (
    <VideoUrlForm
      handleVideoSave={handleVideoSave}
      handleClose={handleVideoClose}
    />
  ) : isLinkClicked ? (
    <LinkForm handleLinkSave={handleLinkSave} handleClose={handleLinkClose} />
  ) : isImageClicked ? (
    <ImageForm
      handleImageSave={handleImageSave}
      setIsImageArray={setIsImageArray}
      index={index}
      handleClose={handleImageClose}
    />
  ) : (
    <div
      className={styles.buttonContainer}
      style={{
        position: isAddSubjectScreen && "relative",
        zIndex: isAddSubjectScreen && -1,
      }}
    >
      <button
        onClick={handleClick}
        onMouseEnter={(e) => hanldeAddHover(e)}
        className={`${styles.addElement} ${isClicked && styles.rotate}`}
      ></button>
      {isClicked && (
        <div className={styles.optionsContainer}>
          <button
            onMouseEnter={(e) => handleTextHover(e)}
            onClick={() => handleTextClick()}
            className={styles.elementOption}
          >
            <BiText />
          </button>
          <button
            onMouseEnter={(e) => handlePhotoHover(e)}
            onClick={handleImageClick}
            className={styles.elementOption}
          >
            <AiOutlineCamera />
          </button>

          <button
            onMouseEnter={(e) => handleVideoHover(e)}
            onClick={() => handleVideoClick()}
            className={styles.elementOption}
          >
            <FaVideo />
          </button>
          <button
            onMouseEnter={(e) => handleLinkHover(e)}
            onClick={() => handleLinkClick()}
            className={styles.elementOption}
          >
            <FaLink />
          </button>
          <button
            onMouseEnter={(e) => handleDividerHover(e)}
            onClick={() => handleDividerClick()}
            className={styles.elementOption}
          >
            <FaMinus />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddElement;
