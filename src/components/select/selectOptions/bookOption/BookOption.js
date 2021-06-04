import React from "react";
import styles from "./BookOption.module.scss";

const BookOption = ({ option }) => {
  let title = "";
  if (option.title) {
    title = option.title;
  } else if (option.label) {
    title = option.label;
  }

  return (
    Object.keys(option).length > 0 && (
      <span className={styles.bookOption}>
        <img
          className={styles.cover}
          src={option.imageSrc}
          alt={`Cover of ${title}`}
        />
        <span>
          <textarea className={styles.title} value={title} />
        </span>
      </span>
    )
  );
};

export default BookOption;
