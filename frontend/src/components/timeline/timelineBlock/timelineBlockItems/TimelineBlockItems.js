import React from "react";
import styles from "./TimelineBlockItems.module.scss";
import Goals from "../goals/Goals";
import Projects from "../projects/Projects";
import Books from "../books/Books";
import Exercises from "../exercises/Exercises";

const TimelineBlockItems = ({ items, type }) => {
  return (
    <>
      {items && items.length > 0 && (
        <>
          <h3 className={styles.header}>{type}</h3>
          <hr style={{ margin: "0.6rem auto 0.6rem auto" }} />

          {type === "Goals" ? (
            <Goals goals={items} />
          ) : type === "Projects" ? (
            <Projects projects={items} />
          ) : type === "Books" ? (
            <Books books={items} />
          ) : (
            type === "Exercises" && <Exercises exercises={items} />
          )}
        </>
      )}
    </>
  );
};

export default TimelineBlockItems;
