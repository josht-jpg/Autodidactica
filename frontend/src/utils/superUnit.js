const superUnit = (subunit) =>
  subunit === "days"
    ? "Week"
    : subunit === "weeks"
    ? "Month"
    : subunit === "months"
    ? "Quarter"
    : subunit === "quarters" && "Year";

export default superUnit;
