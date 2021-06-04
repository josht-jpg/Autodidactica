import styles from "./SetDate.module.scss";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";

const SetDate = ({ dateState, currentDate, number, timelineUnit }) => {
  const [date, setDate] = dateState;

  const dateFormat = "MMMM d, yyyy";

  const timelineUnitLength = () =>
    timelineUnit === "Day"
      ? 1
      : timelineUnit === "Week"
      ? 7
      : timelineUnit === "Month"
      ? 28
      : timelineUnit === "Quarter" && 84;

  const incrementDate = (dateToIncrement) => {
    let copy;
    if (dateToIncrement) {
      copy = new Date(dateToIncrement);
      copy.setDate(copy.getDate() + timelineUnitLength());
    }
    return copy;
  };

  const [minDate, setMinDate] = useState(false);
  const [dateRange, setDateRange] = useState(false);

  useEffect(() => {
    const incrementedDate = incrementDate(currentDate);

    setDate(currentDate ? incrementedDate : new Date());
    setMinDate(currentDate ? incrementedDate : new Date());
    setDateRange(
      incrementedDate
        ? incrementDate(incrementedDate)
        : incrementDate(new Date())
    );
  }, []);

  const handleDateChange = (e) => {
    setDate(e);
    setDateRange(incrementDate(e));
  };

  return (
    <div>
      <h3 className={styles.header}>Set Date</h3>
      <h3 className={styles.date}>
        <DatePicker
          selected={date && date}
          minDate={number !== 1 && minDate} //Allows users to start week 1 and day 1 at different dates: bad
          style={{ textAlign: "center" }}
          dateFormat={dateFormat}
          onChange={(e) => handleDateChange(e)}
          disabled={timelineUnit !== "Day" && number !== 1}
        />

        {timelineUnit !== "Day" && (
          <>
            <h3 className={styles.to}>to</h3>
            <DatePicker
              selected={dateRange}
              dateFormat={dateFormat}
              disabled={true}
            />
          </>
        )}
      </h3>
    </div>
  );
};

export default SetDate;
