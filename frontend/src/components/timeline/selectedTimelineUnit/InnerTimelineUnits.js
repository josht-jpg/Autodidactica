import TimelineBlock from "../timelineBlock/TimelineBlock";

const InnerTimelineUnits = ({
  innerUnits,
  type,
  innerTimeline,
  selectedItemWidth,
  daysLength,
}) => {
  const addBlanksDays = () => {
    let result = innerUnits.slice();
    for (let i = 1; i < innerUnits.length; i++) {
      let blankDays = [];

      for (let j = 0; j < innerUnits[i].dateGap; j++) {
        let blankDate = new Date(innerUnits[i].previousDate);
        blankDate.setDate(blankDate.getDate() + j + 1);

        blankDays.push({
          isBlank: true,
          date: blankDate,
        });
      }

      result.splice(i + (result.length - daysLength), 0, ...blankDays);
    }

    return result;
  };

  if (type === "Week") {
    innerUnits = addBlanksDays();
  }

  return innerUnits.map((innerUnit, index) => (
    <TimelineBlock
      type={`${
        innerTimeline.charAt(0).toUpperCase() +
        innerTimeline.slice(1, innerTimeline.length - 1)
      }`}
      unit={innerUnit}
      selectedItemWidth={selectedItemWidth}
      isLastUnit={index === innerUnits.length - 1}
      isFirstUnit={index === 0}
    />
  ));
};

export default InnerTimelineUnits;
