import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editResourceTextData } from "../../../actions/resourceActions";
import TextAreaAutosize from "react-textarea-autosize";
import styles from "./PublishedDate.module.scss";

const PublishedDate = ({ resource, updateResourceDate, isEditMode }) => {
  const [publishedDateState, setPublishedDateState] = useState(
    resource.publishedDate && resource.publishedDate.slice(0, 4)
  );

  const dispatch = useDispatch();

  const changeDate = (e) => {
    setPublishedDateState(e.target.value);

    updateResourceDate(e.target.value);

    dispatch(
      editResourceTextData(e.target.value, "publishedDate", resource._id)
    );
  };

  return isEditMode ? (
    <>
      <h3 className={styles.editBoxHeader}>Date Published</h3>
      <p
        style={{
          marginTop: "0px",
        }}
        className={styles.publishedDate}
      >
        <TextAreaAutosize
          className={styles.editBox}
          onChange={(e) => changeDate(e)}
          value={publishedDateState}
          disabled={!isEditMode}
        />
      </p>
    </>
  ) : (
    <p className={styles.publishedDate}>{publishedDateState}</p>
  );
};

export default PublishedDate;
