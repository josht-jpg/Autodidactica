import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addExercise } from "../../../../actions/exerciseActions";
import { FaDumbbell } from "react-icons/fa";
import styles from "./AddExerciseScreen.module.scss";
import generateMongoId from "../../../../utils/generateMongoId";
import { MAIN_BLUE } from "../../../../constants/styleConstants";

const AddExerciseScreen = ({ handleCloseAddScreen, handleAddExercise }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    let _id = generateMongoId();
    e.preventDefault();

    if (handleAddExercise) {
      handleAddExercise(title, _id);
    }
    dispatch(addExercise(title, description, _id));
    handleCloseAddScreen();
  };

  return (
    <div className={styles.form}>
      <h1>
        <FaDumbbell style={{ color: MAIN_BLUE }} />
      </h1>

      <div className={styles.inputContainer}>
        <label className={styles.label}>Title</label>
        <input
          className={styles.input}
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

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

      <button className={styles.submit} onClick={(e) => submitHandler(e)}>
        Add Exercise
      </button>
    </div>
  );
};

export default AddExerciseScreen;
