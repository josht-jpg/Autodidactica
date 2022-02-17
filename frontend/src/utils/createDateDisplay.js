import monthNames from "./monthNames";
import dayNames from "./dayNames";

const createDateDisplay = (date, type) => {
  const copy = new Date(date);
  let result;

  if (type === "Day") {
    result = `${dayNames[copy.getDay()]} ${
      monthNames[copy.getMonth()]
    } ${copy.getDate()}`;
  } else if (type === "Week") {
    result = `${monthNames[copy.getMonth()]} ${copy.getDate()} - `;
    copy.setDate(copy.getDate() + 6);
    result += `${monthNames[copy.getMonth()]} ${copy.getDate()}`;
  } else if (type === "Month") {
    result = `${monthNames[copy.getMonth()]} ${copy.getDate()} - `;
    copy.setDate(copy.getDate() + 28);
    result += `${monthNames[copy.getMonth()]} ${copy.getDate()}`;
  } else if (type === "Quarter") {
    result = `${monthNames[copy.getMonth()]} ${copy.getDate()} - `;
    copy.setDate(copy.getDate() + 84);
    result += `${monthNames[copy.getMonth()]} ${copy.getDate()}`;
  }

  return result;
};

export default createDateDisplay;
