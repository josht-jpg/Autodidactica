import Select from "react-select";
import TimelineOption from "../../../../timeline/timelineOption/TimelineOption";
import {
  MultiValueContainer,
  MultiValueRemove,
} from "../../../../select/MultiValue";
import styles from "./TimelineSelect.module.scss";

const TimelineSelect = ({ timeline, titles, handleTimelineChange }) => {
  return timeline.map((timelineUnit) => (
    <div
      className="timeline-select"
      style={{ marginTop: timelineUnit.type === "Day" && "4.5rem" }}
    >
      <label className={styles.selectLabel}>{timelineUnit.type}</label>
      <Select
        isMulti
        value={timelineUnit.unit}
        name={timelineUnit.type}
        className="basic-multi-select"
        placeholder=""
        options={
          titles &&
          titles[timelineUnit.type.toLowerCase() + "s"] &&
          titles[timelineUnit.type.toLowerCase() + "s"].slice().reverse()
        }
        isSearchable={!timelineUnit.unit}
        getOptionLabel={(option) => (
          <TimelineOption
            option={option}
            type={timelineUnit.type}
            isSelected={timelineUnit.unit ? true : false}
          />
        )}
        getOptionValue={(option) => option.title}
        components={{ MultiValueRemove, MultiValueContainer }}
        styles={{
          multiValue: (base) => ({
            ...base,
            backgroundColor: "transparent",
            width: "50%",
          }),
        }}
        onChange={(val) =>
          handleTimelineChange(val && val[0], timelineUnit.type)
        }
      />
    </div>
  ));
};

export default TimelineSelect;
