import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addSubject } from "../../actions/subjectActions";
import styles from "./NewSubject.module.scss";

const NewSubject = ({ handleClose, containerStyles }) => {
  const dispatch = useDispatch();

  const [subject, setSubject] = useState("");

  const history = useHistory();

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(addSubject(subject));
    handleClose && handleClose();
    history.push("/dashboard/days");
    window.location.reload();
  };

  const placeholder =
    "e.g. Graphic Design, Machine Learning, Creative Writing...";

  return (
    <div className={styles.newSubject} style={containerStyles}>
      <form onSubmit={submitHandler} noValidate>
        <h2 style={{ textAlign: "center" }}>
          What subject or skill do you want to dive into?
        </h2>

        <div className={styles.inputContainer}>
          <input
            className={styles.input}
            type="text"
            name="subject-name"
            placeholder={placeholder}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <button className={styles.submit} type="submit">
          Begin
        </button>
      </form>
    </div>
  );
};

export default NewSubject;
