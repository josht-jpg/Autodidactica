import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TextAreaAutosize from "react-textarea-autosize";
import { editAuthors } from "../../../actions/resourceActions";
import styles from "./Authors.module.scss";

const Authors = ({ resource, updateResourceAuthors, isEditMode }) => {
  const [authorsState, setAuthorsState] = useState(resource.authors);

  const dispatch = useDispatch();

  const changeAuthors = (e) => {
    setAuthorsState(e.target.value);
    updateResourceAuthors(e.target.value);
    dispatch(editAuthors(e.target.value, resource._id));
  };

  return isEditMode ? (
    <>
      <h3 className={styles.editBoxHeader}>Authors</h3>
      <p
        style={{
          marginTop: "0px",
        }}
        className={styles.authors}
      >
        <TextAreaAutosize
          className={styles.editBox}
          onChange={(e) => changeAuthors(e)}
          value={authorsState}
          disabled={!isEditMode}
        />
      </p>
    </>
  ) : (
    <p className={styles.authors}>{authorsState}</p>
  );
};

export default Authors;
