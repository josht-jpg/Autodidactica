import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import TextAreaAutosize from "react-textarea-autosize";
import { editDate } from "../../../../actions/timelineActions";
import createDateDisplay from "../../../../utils/createDateDisplay";
import styles from "./TimelineTitle.module.scss";
import { MAIN_BLUE } from "../../../../constants/styleConstants";

const TimelineTitle = ({
  unit,
  type,
  updateTimelineTitle,
  updateDate,
  isEditMode,
}) => {
  const [title, setTitle] = useState(
    unit.title && unit.title !== `${type} ${unit.number}`
      ? unit.title.split(/:(.+)/)[1]
      : ""
  );

  const dispatch = useDispatch();

  const changeTitle = (e) => {
    setTitle(e.target.value);

    const newTitle =
      e.target.value.length > 0
        ? `${type} ${unit.number}: ${e.target.value}`
        : `${type} ${unit.number}`;

    updateTimelineTitle(newTitle);
  };

  const [date, setDate] = useState(new Date(unit.date));

  const incrementDate = (dateToIncrement) => {
    let copy;
    if (dateToIncrement) {
      copy = new Date(dateToIncrement);

      if (type === "Day") {
        copy.setDate(copy.getDate() + 1);
      } else if (type === "Week") {
        copy.setDate(copy.getDate() + 7);
      } else if (type === "Month") {
        copy.setDate(copy.getDate() + 28);
      } else if (type === "Quarter") {
        copy.setDate(copy.getDate() + 92);
      }
    }

    return copy;
  };

  const decrementDate = (dateToIncrement) => {
    let copy;
    if (dateToIncrement) {
      copy = new Date(dateToIncrement);

      if (type === "Day") {
        copy.setDate(copy.getDate() - 1);
      } else if (type === "Week") {
        copy.setDate(copy.getDate() - 7);
      } else if (type === "Month") {
        copy.setDate(copy.getDate() - 28);
      } else if (type === "Quarter") {
        copy.setDate(copy.getDate() - 92);
      }
    }

    return copy;
  };

  const dateChangeRef = useRef(false);

  const dateChange = (e) => {
    dispatch(editDate(e, type, unit.number));
    setDate(e);
    updateDate(e);
    dateChangeRef.current = true;
  };

  useEffect(() => {
    return () => dateChangeRef.current && window.location.reload();
  }, []);

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      {isEditMode ? (
        <>
          <h3 className={styles.editBoxHeader}>Title</h3>
          <div className={styles.editContainer}>
            <h3 className={styles.unitNumber}>{`${type} ${unit.number}:`}</h3>
            <TextAreaAutosize
              className={styles.editBox}
              style={{
                width: title ? `${title.length / 1.1}rem` : "125px",
              }}
              onChange={(e) => changeTitle(e)}
              value={title}
              disabled={!isEditMode}
            />
          </div>
        </>
      ) : (
        <h3 className={styles.title}>
          {unit.title ? unit.title : type + " " + unit.number}
        </h3>
      )}

      <hr
        style={{
          color: MAIN_BLUE,
          marginTop: "4px",
          width:
            unit.title && isEditMode
              ? `${unit.title.length * 12}px`
              : unit.title
              ? `${unit.title.length * 12}px`
              : "100px",
          minWidth: isEditMode ? "228px" : "100px",
        }}
      />

      {isEditMode && type === "Day" ? (
        <>
          <h3 className={styles.editBoxHeader} style={{ marginBottom: "3px" }}>
            Date
          </h3>
          <h3 className={styles.editDate}>
            <DatePicker
              selected={date}
              minDate={unit.number !== 1 && incrementDate(unit.previousDate)}
              maxDate={decrementDate(unit.nextDate)}
              style={{ textAlign: "center" }}
              dateFormat="MMMM d"
              onChange={(e) => dateChange(e)}
            />
          </h3>
        </>
      ) : (
        <h3 className={styles.date}>{createDateDisplay(date, type)}</h3>
      )}
    </div>
  );
};

export default TimelineTitle;
