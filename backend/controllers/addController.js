import asyncHandler from "express-async-handler";
import Year from "../models/yearModel.js";
import Quarter from "../models/quarterModel.js";
import Month from "../models/monthModel.js";
import Week from "../models/weekModel.js";
import Day from "../models/dayModel.js";
import Notepad from "../models/notePadModel.js";
import createGoals from "../utils/createGoals.js";
import Transcript from "../models/transcriptModel.js";
import EditableElement from "../models/editableElementModel.js";
import Goal from "../models/goalModel.js";
import Resource from "../models/resourceModel.js";
import Project from "../models/projectModel.js";
import Exercise from "../models/exerciseModel.js";
import getSubgoal from "../utils/getSubgoals.js";
import getUnitGoals from "../utils/getUnitGols.js";
import sanitize from "mongo-sanitize";

const getDayGoals = async (day, req) => {
  let dayGoals = [];
  let dayProjects = [];
  let dayBooks = [];
  let dayExercises = [];
  await Promise.all(
    day.goals.map(async (goalId) => {
      const goal = await Goal.findOne({
        user: sanitize(req.user._id),
        subject: sanitize(req.headers.subject),
        _id: sanitize(goalId),
        isRemoved: false,
      });
      if (goal) {
        dayGoals.push(goal);

        let resources = [];
        await Promise.all(
          goal.resources.map(async (resourceId) => {
            let resource = await Resource.findOne({
              user: sanitize(req.user._id),
              subject: sanitize(req.headers.subject),
              _id: sanitize(resourceId),
              isRemoved: false,
            });
            if (resource) {
              resources.push(resource);
              if (!dayBooks.some((e) => e._id === resource._id)) {
                dayBooks.push(resource);
              }
            }
          })
        );
        goal.resources = resources;

        let projects = [];
        await Promise.all(
          goal.projects.map(async (projectId) => {
            let project = await Project.findOne({
              user: sanitize(req.user._id),
              subject: sanitize(req.headers.subject),
              _id: sanitize(projectId),
              isRemoved: false,
            });
            if (project) {
              projects.push(project);
              if (!dayProjects.some((e) => e._id === project._id)) {
                dayProjects.push(project);
              }
            }
          })
        );
        goal.projects = projects;

        let exercises = [];
        await Promise.all(
          goal.exercises.map(async (exerciseId) => {
            let exercise = await Exercise.findOne({
              user: sanitize(req.user._id),
              subject: sanitize(req.headers.subject),
              _id: sanitize(exerciseId),
              isRemoved: false,
            });
            exercises.push(exercise);
            if (!dayExercises.some((e) => e._id === exercise._id)) {
              dayExercises.push(exercise);
            }
          })
        );
        goal.exercises = exercises;

        let subgoals = [];
        await Promise.all(
          goal.subgoals.map(async (subgoal) => {
            subgoal = await getSubgoal(
              subgoal,
              dayProjects,
              dayBooks,
              dayExercises,
              req
            );
            subgoals.push(subgoal);
          })
        );
        goal.subgoals = subgoals;
      }
    })
  );

  return { dayGoals, dayProjects, dayBooks, dayExercises };
};

const createEditableElements = async (isDay, userId, subjectId) => {
  const titleElement = await EditableElement.create({
    user: userId,
    subjectId: subjectId,
    type: "TITLE",
  });

  const goalsElement = await EditableElement.create({
    user: userId,
    subjectId: subjectId,
    type: "GOALS",
  });

  const projectsElement = await EditableElement.create({
    user: userId,
    subjectId: subjectId,
    type: "PROJECTS",
  });

  const resourcesElement = await EditableElement.create({
    user: userId,
    subjectId: subjectId,
    type: "RESOURCES",
  });

  const exercisesElement = await EditableElement.create({
    user: userId,
    subjectId: subjectId,
    type: "EXERCISES",
  });

  const notesElement = await EditableElement.create({
    user: userId,
    subjectId: subjectId,
    type: "NOTES",
  });

  let result = [
    titleElement,
    goalsElement,
    projectsElement,
    resourcesElement,
    exercisesElement,
    notesElement,
  ];

  if (!isDay) {
    const innerTimelineElement = await EditableElement.create({
      user: userId,
      subjectId: subjectId,
      type: "INNER_TIMELINE",
    });
    result.push(innerTimelineElement);
  }

  return result;
};

const expandTimelineFromQuarter = async (
  quarterNumber,
  date,
  userId,
  subject
) => {
  //if (quarterNumber % 4 === 1) {
  const year = await Year.findOne({ user: userId, subject: subject }).sort(
    "-number"
  );

  let maxYear;
  if (year) {
    maxYear = year.number;
  } else {
    maxYear = 0;
  }

  if (quarterNumber > 4 * maxYear) {
    const notepad = await Notepad.create({
      user: userId,
      name: `Year ${maxYear + 1}`,
      year: maxYear + 1,
      subject: subject,
    });

    let newYear = await Year.create({
      user: userId,
      subject: subject,
      notepad,
      date,
      quarters: [quarterNumber],
      number: maxYear + 1,
    });

    return newYear;
  } else if (year && !year.quarters.includes(quarterNumber)) {
    await Year.updateOne(
      { user: userId, subject: subject, _id: year._id },
      { $push: { quarters: quarterNumber } }
    );

    //expandTimelineFromQuarter(maxYear, date, userId, subject);
  }
  //}
};

const expandTimelineFromMonth = async (monthNumber, date, userId, subject) => {
  //if (monthNumber % 3 === 1) {
  const quarter = await Quarter.findOne({
    user: userId,
    subject: subject,
  }).sort("-number");

  let maxQuarter;
  if (quarter) {
    maxQuarter = quarter.number;
  } else {
    maxQuarter = 0;
  }

  if (monthNumber > 3 * maxQuarter) {
    const notepad = await Notepad.create({
      user: userId,
      name: `Quarter ${maxQuarter + 1}`,
      quarter: maxQuarter + 1,
      subject: subject,
    });

    const editableElements = await createEditableElements(
      false,
      userId,
      subject
    );

    let newQuarter = await Quarter.create({
      user: userId,
      subject: subject,
      notepad,
      date,
      months: [monthNumber],
      number: maxQuarter + 1,
      editableElements,
    });

    expandTimelineFromQuarter(maxQuarter + 1, date, userId, subject);
    return newQuarter;
  } else if (!quarter.months.includes(monthNumber)) {
    await Quarter.updateOne(
      { user: userId, subject: subject, _id: quarter._id },
      { $push: { months: monthNumber } }
    );

    expandTimelineFromQuarter(maxQuarter, date, userId, subject);
  }
  // }
};

const expandTimelineFromWeek = async (weekNumber, date, userId, subject) => {
  //if (weekNumber % 4 === 1) {
  const month = await Month.findOne({ user: userId, subject: subject }).sort(
    "-number"
  );

  let maxMonth;
  if (month) {
    maxMonth = month.number;
  } else {
    maxMonth = 0;
  }

  if (weekNumber > 4 * maxMonth) {
    const notepad = await Notepad.create({
      user: userId,
      name: `Month ${maxMonth + 1}`,
      month: maxMonth + 1,
      subject: subject,
    });

    const editableElements = await createEditableElements(
      false,
      userId,
      subject
    );

    let newMonth = await Month.create({
      user: userId,
      subject: subject,
      notepad,
      date,
      weeks: [weekNumber],
      number: maxMonth + 1,
      editableElements,
    });

    expandTimelineFromMonth(maxMonth + 1, date, userId, subject);
    return newMonth;
  } else if (!month.weeks.includes(weekNumber)) {
    await Month.updateOne(
      {
        user: userId,
        subject: subject,
        _id: month._id,
      },
      { $push: { weeks: weekNumber } }
    );
    expandTimelineFromMonth(maxMonth, date, userId, subject);
  }
  // }
};

const expandTimelineFromDay = async (
  dayNumber,

  date,
  userId,
  subject
) => {
  //if (dayNumber % 7 === 1) {
  const week = await Week.findOne({ user: userId, subject: subject }).sort(
    "-number"
  );

  let maxWeek;
  if (week) {
    maxWeek = week.number;
  } else {
    maxWeek = 0;
  }

  //if (dayNumber > 7 * maxWeek) {
  const notepad = await Notepad.create({
    user: userId,
    name: `Week ${maxWeek + 1}`,
    week: maxWeek + 1,
    subject: subject,
  });

  const editableElements = await createEditableElements(false, userId, subject);

  let newWeek = await Week.create({
    user: userId,
    subject: subject,
    notepad,
    date,
    days: [dayNumber],
    number: maxWeek + 1,

    editableElements,
  });

  expandTimelineFromWeek(maxWeek + 1, date, userId, subject);
  //}
  //}
  return newWeek;
};

const addYear = asyncHandler(async (req, res) => {
  const years = await Year.find({
    user: sanitize(req.user._id),
    subject: sanitize(req.headers.subject),
  });

  const { goals } = req.body;
  const number = years.length + 1;
  const goalIds = await createGoals(
    goals,
    sanitize(req.user._id),
    sanitize(req.headers.subject),
    number,
    YEAR
  );

  const notepad = await Notepad.create({
    user: sanitize(req.user._id),
    name: `Year ${number}`,
    year: number,
    subject: sanitize(req.headers.subject),
  });

  const year = await Year.create({
    user: sanitize(req.user._id),
    number,
    goals: goalIds,
    notepad: sanitize(notepad._id),
    subject: sanitize(req.headers.subject),
  });

  if (year) {
    res.status(201).json({
      user: year.user,
      number: year.number,
      goals: year.goals,
      notepad: year.notepad,
      subject: year.subject,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Year Data");
  }
});

const addQuarter = asyncHandler(async (req, res) => {
  const quarters = await Quarter.find({
    user: sanitize(req.user._id),
    subject: sanitize(req.headers.subject),
  });

  const { goals, title, date } = req.body;
  const number = quarters.length + 1;

  const editableElements = await createEditableElements(
    false,
    sanitize(req.user._id),
    sanitize(req.headers.subject)
  );

  const notepad = await Notepad.create({
    user: sanitize(req.user._id),
    name: `Quarter ${number}`,
    quarter: number,
    subject: sanitize(req.headers.subject),
  });

  const quarter = await Quarter.create({
    user: sanitize(req.user._id),
    number: sanitize(number),
    goals: goals.map((goal) => goal && goal._id),
    notepad: notepad._id,
    subject: sanitize(req.headers.subject),
    title: sanitize(title),
    date: sanitize(date),
    editableElements,
  });

  let newYear;
  if (quarter) {
    newYear = await expandTimelineFromQuarter(
      quarter.number,
      quarter.date,
      sanitize(req.user._id),
      sanitize(req.headers.subject)
    );

    const transcript = await Transcript.findOne({
      user: sanitize(req.user._id),
      subjectId: sanitize(req.headers.subject),
    });
    await Transcript.updateOne(
      { _id: transcript._id },
      {
        $push: {
          quarters: {
            _id: quarter._id,
            orderIndex: transcript.quarters.length,
          },
        },
      }
    );

    let quarterData = await getUnitGoals(quarter, req);

    let returnQuarter = {
      number,
      goals: quarterData.unitGoals,
      projects: quarterData.unitProjects,
      books: quarterData.unitBooks,
      exercises: quarterData.unitExercises,
      notepad: notepad._id,
      type: quarter.type,
      title,
      date,
      editableElements,
    };
    if (newYear) {
      newYear.quarters = [returnQuarter];
    }

    res.status(201).json({
      newUnit: newYear,
      unit: returnQuarter,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Quarter Data");
  }
});

const addMonth = asyncHandler(async (req, res) => {
  const months = await Month.find({
    user: sanitize(req.user._id),
    subject: sanitize(req.headers.subject),
  });

  const { goals, title, date } = req.body;
  const number = months.length + 1;

  const editableElements = await createEditableElements(
    false,
    sanitize(req.user._id),
    sanitize(req.headers.subject)
  );

  const notepad = await Notepad.create({
    user: sanitize(req.user._id),
    name: `Month ${number}`,
    month: number,
    subject: sanitize(req.headers.subject),
  });

  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  const month = await Month.create({
    user: sanitize(req.user._id),
    number,
    goals: goals.map((goal) => goal && goal._id),
    notepad: sanitize(notepad._id),
    subject: sanitize(req.headers.subject),
    title: sanitize(title),
    date: sanitize(date),
    editableElements,
  });

  if (month) {
    await Month.updateOne(
      {
        user: sanitize(req.user._id),
        subject: sanitize(req.headers.subject),
        number: number - 1,
      },
      { nextDate: date }
    );

    let copy = new Date(date);
    let copyDecremented = new Date(date);
    copyDecremented.setDate(copyDecremented.getDate() - 84);

    const quarter = await Quarter.findOneAndUpdate(
      {
        user: sanitize(req.user._id),
        subject: sanitize(req.headers.subject),

        date: {
          $lte: copy,
          $gt: copyDecremented,
        },
      },
      { $push: { months: month.number } },
      { useFindAndModify: false }
    );

    if (!quarter) {
      copy.setHours(0, 0, 0, 0);

      var newQuarter = await expandTimelineFromMonth(
        month.number,
        copy,
        sanitize(req.user._id),
        sanitize(req.headers.subject)
      );
      await Month.updateOne(
        {
          user: sanitize(req.user._id),
          subject: sanitize(req.headers.subject),
          _id: month._id,
        },
        { isFirstOfQuarter: true }
      );
    } else if (month.number % 3 === 1) {
      newQuarter = quarter;
    }

    const transcript = await Transcript.findOne({
      user: sanitize(req.user._id),
      subjectId: sanitize(req.headers.subject),
    });
    await Transcript.updateOne(
      { _id: transcript._id },
      {
        $push: {
          months: { _id: month._id, orderIndex: transcript.months.length },
        },
      }
    );

    let monthData = await getUnitGoals(month, req);

    let returnMonth = {
      number,
      goals: monthData.unitGoals,
      projects: monthData.unitProjects,
      books: monthData.unitBooks,
      exercises: monthData.unitExercises,
      type: month.type,
      notepad: notepad._id,
      title,
      date: copy,
      editableElements,
    };
    if (newQuarter) {
      newQuarter.months = [returnMonth];
      // newQuarter.title = `Quarter ${newQuarter.number}`;
    }

    res.status(201).json({
      newUnit: newQuarter,
      unit: returnMonth,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Month Data");
  }
});

const addWeek = asyncHandler(async (req, res) => {
  const weeks = await Week.find({
    user: sanitize(req.user._id),
    subject: sanitize(req.headers.subject),
  });

  const { goals, title, date } = req.body;
  const number = weeks.length + 1;

  const editableElements = await createEditableElements(
    false,
    sanitize(req.user._id),
    sanitize(req.headers.subject)
  );

  const notepad = await Notepad.create({
    user: sanitize(req.user._id),
    name: title ? sanitize(title) : `Week ${number}`,
    week: number,
    subject: sanitize(req.headers.subject),
  });

  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  const week = await Week.create({
    user: sanitize(req.user._id),
    number,
    goals: goals.map((goal) => goal && goal._id),
    notepad: notepad._id,
    subject: sanitize(req.headers.subject),
    title: sanitize(title),
    date: sanitize(copy),
    editableElements,
  });

  if (week) {
    await Week.updateOne(
      {
        user: sanitize(req.user._id),
        subject: sanitize(req.headers.subject),
        number: number - 1,
      },
      { nextDate: date }
    );

    let copy = new Date(date);
    let copyDecremented = new Date(date);
    copyDecremented.setDate(copyDecremented.getDate() - 28);

    const month = await Month.findOneAndUpdate(
      {
        user: sanitize(req.user._id),
        subject: sanitize(req.headers.subject),

        date: {
          $lte: copy,
          $gt: copyDecremented,
        },
      },
      { $push: { weeks: week.number } },
      { useFindAndModify: false }
    );

    let newMonth;
    if (!month) {
      copy.setHours(0, 0, 0, 0);

      newMonth = await expandTimelineFromWeek(
        week.number,
        copy /* week.date, */, ///Herererrererererererererererere  --- copy?
        sanitize(req.user._id),
        sanitize(req.headers.subject)
      );
      await Week.updateOne(
        {
          user: sanitize(req.user._id),
          subject: sanitize(req.headers.subject),
          _id: week._id,
        },
        { isFirstOfMonth: true }
      );
    } else if (week.number % 4 === 1) {
      newMonth = month;
    }

    const transcript = await Transcript.findOne({
      user: sanitize(req.user._id),
      subjectId: sanitize(req.headers.subject),
    });
    await Transcript.updateOne(
      { _id: transcript._id },
      {
        $push: {
          weeks: { _id: week._id, orderIndex: transcript.weeks.length },
        },
      }
    );

    let weekData = await getUnitGoals(week, req);

    let returnWeek = {
      number,
      goals: weekData.unitGoals,
      projects: weekData.unitProjects,
      books: weekData.unitBooks,
      exercises: weekData.unitExercises,
      type: week.type,
      notepad: notepad._id,
      title,
      date: copy,
      editableElements,
    };
    if (newMonth) {
      newMonth.weeks = [returnWeek];
    }

    res.status(201).json({
      newUnit: newMonth,
      unit: returnWeek,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Week Data");
  }
});

const addDay = asyncHandler(async (req, res) => {
  const days = await Day.find({
    user: sanitize(req.user._id),
    subject: sanitize(req.headers.subject),
  });
  const { goals, title, date } = req.body;

  const number = days.length + 1;

  const editableElements = await createEditableElements(
    true,
    sanitize(req.user._id),
    sanitize(req.headers.subject)
  );

  const notepad = await Notepad.create({
    user: sanitize(req.user._id),
    name: title ? sanitize(title) : `Day ${number}`,
    day: number,
    subject: sanitize(req.headers.subject),
  });

  const previousDateObj = await Day.findOne({
    user: sanitize(req.user._id),
    subject: sanitize(req.headers.subject),
    number: number - 1,
  }).select("date");

  let dateGap;
  let previousDate;
  if (previousDateObj) {
    previousDate = previousDateObj.date;
    let dateCopy = new Date(date);

    const diffTime = Math.abs(dateCopy - previousDate);
    dateGap = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
  }

  let day = await Day.create({
    user: sanitize(req.user._id),
    number,
    goals: goals.map((goal) => goal && goal._id),
    notepad: notepad._id,
    subject: sanitize(req.headers.subject),
    date: sanitize(date),
    previousDate: previousDate,
    dateGap,
    title: sanitize(title),
    editableElements,
  });

  if (day) {
    await Day.updateOne(
      {
        user: sanitize(req.user._id),
        subject: sanitize(req.headers.subject),
        number: number - 1,
      },
      { nextDate: date }
    );

    let copy = new Date(date);
    let copyDecremented = new Date(date);
    copyDecremented.setDate(copyDecremented.getDate() - 7);

    const week = await Week.findOneAndUpdate(
      {
        user: sanitize(req.user._id),
        subject: sanitize(req.headers.subject),

        date: {
          $lte: copy,
          $gt: copyDecremented,
        },
      },
      { $push: { days: day.number } },
      { useFindAndModify: false }
    );

    let newWeek;
    if (!week) {
      copy.setHours(0, 0, 0, 0);
      newWeek = await expandTimelineFromDay(
        day.number,
        copy,
        sanitize(req.user._id),
        sanitize(req.headers.subject)
      );

      await Day.updateOne(
        {
          user: sanitize(req.user._id),
          subject: sanitize(req.headers.subject),
          _id: day._id,
        },
        { isFirstOfWeek: true }
      );
    } else {
      let weekDate = new Date(week.date);
      if (copy.getDate() === weekDate.getDate()) {
        newWeek = week;
      }
    }

    const transcript = await Transcript.findOne({
      user: sanitize(req.user._id),
      subjectId: sanitize(req.headers.subject),
    });
    await Transcript.updateOne(
      { _id: transcript._id },
      { $push: { days: { _id: day._id, orderIndex: transcript.days.length } } }
    );

    let dayData = await getDayGoals(day, req);

    let returnDay = {
      number,
      goals: dayData.dayGoals,
      projects: dayData.dayProjects,
      books: dayData.dayBooks,
      exercises: dayData.dayExercises,
      notepad: notepad._id,
      type: day.type,
      date,
      previousDate: previousDate,
      dateGap,
      title,
      editableElements,
    };
    if (newWeek) {
      newWeek.days = [returnDay];
    }

    res.status(201).json({ unit: returnDay, newUnit: newWeek });
  } else {
    res.status(400);
    throw new Error("Invalid Day Data");
  }
});

export { addDay, addWeek, addMonth, addQuarter, addYear };
