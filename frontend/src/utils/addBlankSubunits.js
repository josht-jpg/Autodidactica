const compare = (a, b) => {
  if (a.number < b.number) {
    return -1;
  }
  if (a.number > b.number) {
    return 1;
  }
  return 0;
};

/*
 * Currently only works with days
 */

const addBlankSubunits = (unit, timelineType) => {
  let subunits = unit[timelineType] && unit[timelineType].sort(compare);

  if (subunits && timelineType === "days") {
    let result = subunits.slice();
    for (let i = 1; i < subunits.length; i++) {
      let blankDays = [];

      for (let j = 0; j < subunits[i].dateGap; j++) {
        let blankDate = new Date(subunits[i].previousDate);
        blankDate.setDate(blankDate.getDate() + j + 1);

        blankDays.push({
          isBlank: true,
          date: blankDate,
        });
      }

      result.splice(i + (result.length - unit.days.length), 0, ...blankDays);
    }
    return result;
  }
  return subunits;
};

export default addBlankSubunits;
