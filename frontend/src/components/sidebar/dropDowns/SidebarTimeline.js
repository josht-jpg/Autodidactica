import { useEffect, useMemo, useState } from "react";
import { BiCaretDown, BiCaretRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";
import dropDownStyles from "./sidebarDropDown.module.scss";

const path = (option) => "/dashboard/" + option.toLowerCase();

const SidebarTimeline = ({
  currentOption,
  isTranscript,
  timeline,
  scrollTo,
}) => {
  const options = useMemo(
    () =>
      timeline
        ? timeline.timelineTypes
        : ["Days", "Weeks", "Months", "Quarters"],
    [timeline]
  );

  const dropDownState = () =>
    sessionStorage.getItem("isTimelineSelected")
      ? JSON.parse(sessionStorage.getItem("isTimelineSelected"))
      : true;

  const [isSelected, setIsSelected] = useState(options && dropDownState());

  useEffect(() => {
    setIsSelected(options && dropDownState());
  }, [options]);

  const toggle = () => {
    sessionStorage.setItem("isTimelineSelected", !isSelected);
    setIsSelected((prev) => !prev);
  };

  return (
    <div style={{ fontWeight: "bold" }}>
      <p className={dropDownStyles.header} onClick={toggle}>
        {isSelected ? <BiCaretDown /> : <BiCaretRight />} Timeline{" "}
      </p>

      <div
        className={dropDownStyles.optionsContainer}
        style={{
          maxHeight: isSelected ? "260px" : "0px",
        }}
      >
        {options &&
          options.map((option, index) => (
            <li
              key={`${option}-${index}`}
              className={
                option === currentOption && !isTranscript
                  ? dropDownStyles.selectedOption
                  : dropDownStyles.option
              }
            >
              {!isTranscript ? (
                <Link key={`${index}-sidebar-view`} to={path(option)}>
                  {option}
                </Link>
              ) : (
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    scrollTo("timelineRef");
                    timeline.handleTimelineSelect(option.toLowerCase(), false);
                  }}
                >
                  {capitalizeFirstLetter(option)}
                </a>
              )}
            </li>
          ))}
      </div>
    </div>
  );
};

export default SidebarTimeline;
