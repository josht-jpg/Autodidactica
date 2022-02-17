import asyncHandler from "express-async-handler";
import Transcript from "../models/transcriptModel.js";
import Goal from "../models/goalModel.js";
import Resource from "../models/resourceModel.js";
import Project from "../models/projectModel.js";
import Exercise from "../models/exerciseModel.js";
import Notepad from "../models/notePadModel.js";
import Days from "../models/dayModel.js";
import Weeks from "../models/weekModel.js";
import Months from "../models/monthModel.js";
import Quarters from "../models/quarterModel.js";
import TranscriptElement from "../models/transcriptElementModel.js";
import EditableElement from "../models/editableElementModel.js";
import mongoose from "mongoose";
import uploadImage from "../utils/uploadImage.js";
import getTimelineUnitData from "../utils/getTimelineUnitData.js";
import User from "../models/userModel.js";
import Subject from "../models/subjectModel.js";
import sanitize from "mongo-sanitize";

const getSubgoal = async (goal, userId, subjectId, recNum) => {
  if (recNum > 10000) {
    return false;
  }

  goal = await Goal.findOne({ _id: goal, isRemoved: false }).lean();

  if (goal) {
    let resources = [];
    await Promise.all(
      goal.resources.map(async (resource) => {
        resource = await Resource.findOne(
          {
            user: userId,
            subject: subjectId,
            _id: resource,
            isRemoved: false,
          },
          "-user -createdAt -updatedAt"
        );
        if (resource) {
          resources.push(resource);
        }
      })
    );
    goal.resources = resources;

    let projects = [];
    await Promise.all(
      goal.projects.map(async (project) => {
        project = await Project.findOne(
          {
            user: userId,
            subject: subjectId,
            _id: project,
            isRemoved: false,
          },
          "-user -createdAt -updatedAt"
        );
        if (project) {
          projects.push(project);
        }
      })
    );
    goal.projects = projects;

    let exercises = [];
    await Promise.all(
      goal.exercises.map(async (exercise) => {
        exercise = await Exercise.findOne(
          {
            user: userId,
            subject: subjectId,
            _id: exercise,
            isRemoved: false,
          },
          "-user -createdAt -updatedAt"
        );
        exercises.push(exercise);
      })
    );
    goal.exercises = exercises;

    let subgoals = [];
    await Promise.all(
      goal.subgoals.map(async (subgoal) => {
        subgoal = await getSubgoal(subgoal, userId, subjectId, recNum + 1);
        subgoals.push(subgoal);
      })
    );
    goal.subgoals = subgoals;
  }

  return goal;
};

function compare(a, b) {
  if (a.orderIndex < b.orderIndex) {
    return -1;
  }
  if (a.orderIndex > b.orderIndex) {
    return 1;
  }
  return 0;
}

const getTranscript = asyncHandler(async (req, res) => {
  //Yo don't think i need to do any sort(compare) in here

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  let accomplishmentsData = [];
  await Promise.all(
    transcript.accomplishments.map(async (accomplishment) => {
      const accomplishmentData = await Goal.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: accomplishment._id,
        isRemoved: false,
      }).lean();

      if (accomplishmentData) {
        let resources = [];
        await Promise.all(
          accomplishmentData.resources.map(async (resource) => {
            resource = await Resource.findOne({
              user: req.user._id,
              subject: req.headers.subject,
              _id: resource,
            });
            resources.push(resource);
          })
        );
        accomplishmentData.resources = resources;

        let projects = [];
        await Promise.all(
          accomplishmentData.projects.map(async (project) => {
            project = await Project.findOne({
              user: req.user._id,
              subject: req.headers.subject,
              _id: project,
              isRemoved: false,
            });
            projects.push(project);
          })
        );
        accomplishmentData.projects = projects;

        let exercises = [];
        await Promise.all(
          accomplishmentData.exercises.map(async (exercise) => {
            exercise = await Exercise.findOne({
              user: req.user._id,
              subject: req.headers.subject,
              _id: exercise,
              isRemoved: false,
            });
            exercises.push(exercise);
          })
        );
        accomplishmentData.exercises = exercises;

        //Not the best way tot this, we're grabbing goals more than once.
        let subgoals = [];

        await Promise.all(
          accomplishmentData.subgoals.map(async (subgoal) => {
            subgoal = await getSubgoal(
              subgoal,
              req.user._id,
              req.headers.subject,
              0
            );
            subgoals.push(subgoal);
          })
        );
        accomplishmentData.subgoals = subgoals;

        accomplishmentData.orderIndex = accomplishment.orderIndex;

        accomplishmentsData.push(accomplishmentData);
      }
    })
  );

  transcript.accomplishments = accomplishmentsData;

  let projectsData = [];
  await Promise.all(
    transcript.projects.sort(compare).map(async (project) => {
      const projectData = await Project.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: project._id,
        isRemoved: false,
      }).lean();
      if (projectData) {
        projectData.orderIndex = project.orderIndex;
        projectsData.push(projectData);
      }
    })
  );

  transcript.projects = projectsData;

  let resourcesData = [];
  await Promise.all(
    transcript.resources.sort(compare).map(async (resourceObj) => {
      const resourceData = await Resource.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: resourceObj.resource,
      }).lean();
      if (resourceData) {
        resourceData.orderIndex = resourceObj.orderIndex;
        resourcesData.push(resourceData);
      }
    })
  );

  transcript.resources = resourcesData;

  let exercisesData = [];
  await Promise.all(
    transcript.exercises.sort(compare).map(async (exercise) => {
      const exerciseData = await Exercise.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: exercise._id,
        isRemoved: false,
      }).lean();
      if (exerciseData) {
        exerciseData.orderIndex = exercise.orderIndex;
      }
      exercisesData.push(exerciseData);
    })
  );

  transcript.exercises = exercisesData;

  let notepadsData = [];
  await Promise.all(
    transcript.notepads.map(async (notepad) => {
      let notepadData = await Notepad.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: notepad._id,
        isRemoved: false,
      }).lean();

      if (notepadData) {
        notepadData.orderIndex = notepad.orderIndex;

        if (notepadData.resource) {
          notepadData.resource = await Resource.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: notepadData.resource,
          });
        } else if (notepadData.project) {
          notepadData.project = await Project.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: notepadData.project,
          });
        } else if (notepadData.exercise) {
          notepadData.exercise = await Exercise.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: notepadData.exercise,
          });
        }
        notepadsData.push(notepadData);
      }
    })
  );

  transcript.notepads = notepadsData;

  transcript.timeline = {};
  transcript.timeline.types = [];

  const quarters = await Quarters.find({
    user: req.user._id,
    subject: req.headers.subject,
    "goals.0": { $exists: true },
  }).lean();

  await getTimelineUnitData(
    quarters,
    "quarter",
    req.user._id,
    req.headers.subject
  );

  transcript.timeline.quarters = quarters;
  quarters.length > 0 && transcript.timeline.types.push("quarters");

  //let monthsData = [];
  const months = await Months.find({
    user: req.user._id,
    subject: req.headers.subject,
    "goals.0": { $exists: true },
  }).lean();

  await getTimelineUnitData(months, "month", req.user._id, req.headers.subject);

  transcript.timeline.months = months;
  months.length > 0 && transcript.timeline.types.push("months");

  let weeksData = [];
  const weeks = await Weeks.find({
    user: req.user._id,
    subject: req.headers.subject,
    "goals.0": { $exists: true },
  }).lean();

  //should be a function
  await Promise.all(
    weeks.map(async (weekData) => {
      let weekGoals = [];
      let weekProjects = [];
      let weekBooks = [];
      let weekExercises = [];
      await Promise.all(
        weekData.goals.map(async (goalId) => {
          const goal = await Goal.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: goalId,
            isRemoved: false,
          });
          if (goal) {
            weekGoals.push(goal);

            let resources = [];
            await Promise.all(
              goal.resources.map(async (resourceId) => {
                let resource = await Resource.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: resourceId,
                });
                resources.push(resource);
                weekBooks.push(resource);
              })
            );
            goal.resources = resources;

            let projects = [];
            await Promise.all(
              goal.projects.map(async (projectId) => {
                let project = await Project.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: projectId,
                  // isRemoved: false,
                });
                projects.push(project);
                weekProjects.push(project);
              })
            );
            goal.projects = projects;

            let exercises = [];
            await Promise.all(
              goal.exercises.map(async (exerciseId) => {
                let exercise = await Exercise.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: exerciseId,
                  isRemoved: false,
                });
                exercises.push(exercise);
                weekExercises.push(exercise);
              })
            );

            goal.exercises = exercises;
          }
        })
      );

      weekData.goals = weekGoals;
      weekData.projects = weekProjects;
      weekData.books = weekBooks;
      weekData.exercises = weekExercises;

      weeksData.push(weekData);
    })
  );

  transcript.timeline.weeks = weeksData;
  weeksData.length > 0 && transcript.timeline.types.push("weeks");

  let daysData = [];

  const days = await Days.find({
    user: req.user._id,
    subject: req.headers.subject,
    "goals.0": { $exists: true },
  }).lean();

  //should be a function
  await Promise.all(
    days.map(async (dayData) => {
      let dayGoals = [];
      let dayProjects = [];
      let dayBooks = [];
      let dayExercises = [];
      await Promise.all(
        dayData.goals.map(async (goalId) => {
          const goal = await Goal.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: goalId,
            isRemoved: false,
          });
          if (goal) {
            dayGoals.push(goal);

            let resources = [];
            await Promise.all(
              goal.resources.map(async (resourceId) => {
                let resource = await Resource.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: resourceId,
                });
                resources.push(resource);
                dayBooks.push(resource);
              })
            );
            goal.resources = resources;

            let projects = [];
            await Promise.all(
              goal.projects.map(async (projectId) => {
                let project = await Project.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: projectId,
                  // isRemoved: false,
                });
                projects.push(project);
                dayProjects.push(project);
              })
            );
            goal.projects = projects;

            let exercises = [];
            await Promise.all(
              goal.exercises.map(async (exerciseId) => {
                let exercise = await Exercise.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: exerciseId,
                  isRemoved: false,
                });
                exercises.push(exercise);
                dayExercises.push(exercise);
              })
            );

            goal.exercises = exercises;
          }
        })
      );

      dayData.goals = dayGoals;
      dayData.projects = dayProjects;
      dayData.books = dayBooks;
      dayData.exercises = dayExercises;
      daysData.push(dayData);
    })
  );

  transcript.timeline.days = daysData;
  daysData.length > 0 && transcript.timeline.types.push("days");

  transcript.timeline.types.reverse();

  res.json(transcript);
});

const editTranscriptTextData = asyncHandler(async (req, res) => {
  const { text, _id } = req.body;

  const cleanText = sanitize(text);

  //await TranscriptElement.updateOne({_id: _id}, {text: text})

  //Real bad way of doing this...

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  for (const element of transcript.transcriptElements) {
    if (element._id.toString() === _id) {
      element.text = cleanText;
    }
  }

  await Transcript.updateOne(
    { _id: transcript._id },
    { transcriptElements: transcript.transcriptElements }
  );

  res.json(true);
});

const editText = asyncHandler(async (req, res) => {
  const { text, elementId, materialId } = req.body;
  const cleanText = sanitize(text);

  await EditableElement.updateOne({ _id: elementId }, { text: cleanText });

  //change -- definitely change
  const transcipt = await Transcript.findOne({ _id: materialId }).lean();
  for (const element of transcipt.transcriptElements) {
    if (element._id == elementId) {
      //oofff
      element.text = cleanText;
    }
  }
  await Transcript.updateOne(
    { _id: materialId },
    { transcriptElements: transcipt.transcriptElements }
  );

  res.json(true);
});

const rearrangeAccomplishments = asyncHandler(async (req, res) => {
  const { draggingIndex, newIndex } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  let changingId;
  for (let accomplishmentData of transcript.accomplishments) {
    if (accomplishmentData.orderIndex === draggingIndex) {
      accomplishmentData.orderIndex = newIndex;
      changingId = accomplishmentData._id;
    }
  }
  if (draggingIndex > newIndex) {
    for (let accomplishmentData of transcript.accomplishments) {
      if (
        accomplishmentData.orderIndex >= newIndex &&
        accomplishmentData.orderIndex <= draggingIndex &&
        accomplishmentData._id !== changingId
      ) {
        accomplishmentData.orderIndex += 1;
      }
    }
  } else {
    for (let accomplishmentData of transcript.accomplishments) {
      if (
        accomplishmentData.orderIndex <= newIndex &&
        accomplishmentData.orderIndex >= draggingIndex &&
        accomplishmentData._id !== changingId
      ) {
        accomplishmentData.orderIndex -= 1;
      }
    }
  }

  await Transcript.updateOne(
    { _id: transcript._id },
    { accomplishments: transcript.accomplishments }
  );

  res.json(transcript);
});

const rearrangeResources = asyncHandler(async (req, res) => {
  const { draggingIndex, newIndex } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  let changingId;
  for (let resourceData of transcript.resources) {
    if (resourceData.orderIndex === draggingIndex) {
      resourceData.orderIndex = newIndex;
      changingId = resourceData.resource;
    }
  }
  if (draggingIndex > newIndex) {
    for (let resourceData of transcript.resources) {
      if (
        resourceData.orderIndex >= newIndex &&
        resourceData.orderIndex <= draggingIndex &&
        resourceData.resource !== changingId
      ) {
        resourceData.orderIndex += 1;
      }
    }
  } else {
    for (let resourceData of transcript.resources) {
      if (
        resourceData.orderIndex <= newIndex &&
        resourceData.orderIndex >= draggingIndex &&
        resourceData.resource !== changingId
      ) {
        resourceData.orderIndex -= 1;
      }
    }
  }

  await Transcript.updateOne(
    { _id: transcript._id },
    { resources: transcript.resources }
  );

  res.json(transcript);
});

const rearrangeExercises = asyncHandler(async (req, res) => {
  const { draggingIndex, newIndex } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  let changingId;
  for (let exerciseData of transcript.exercises) {
    if (exerciseData.orderIndex === draggingIndex) {
      exerciseData.orderIndex = newIndex;
      changingId = exerciseData._id;
    }
  }
  if (draggingIndex > newIndex) {
    for (let exerciseData of transcript.exercises) {
      if (
        exerciseData.orderIndex >= newIndex &&
        exerciseData.orderIndex <= draggingIndex &&
        exerciseData._id !== changingId
      ) {
        exerciseData.orderIndex += 1;
      }
    }
  } else {
    for (let exerciseData of transcript.exercises) {
      if (
        exerciseData.orderIndex <= newIndex &&
        exerciseData.orderIndex >= draggingIndex &&
        exerciseData._id !== changingId
      ) {
        exerciseData.orderIndex -= 1;
      }
    }
  }

  await Transcript.updateOne(
    { _id: transcript._id },
    { exercises: transcript.exercises }
  );

  res.json(transcript);
});

const rearrangeProjects = asyncHandler(async (req, res) => {
  const { draggingIndex, newIndex } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  let changingId;
  for (let projectData of transcript.projects) {
    if (projectData.orderIndex === draggingIndex) {
      projectData.orderIndex = newIndex;
      changingId = projectData._id;
    }
  }
  if (draggingIndex > newIndex) {
    for (let projectData of transcript.projects) {
      if (
        projectData.orderIndex >= newIndex &&
        projectData.orderIndex <= draggingIndex &&
        projectData._id !== changingId
      ) {
        projectData.orderIndex += 1;
      }
    }
  } else {
    for (let projectData of transcript.projects) {
      if (
        projectData.orderIndex <= newIndex &&
        projectData.orderIndex >= draggingIndex &&
        projectData._id !== changingId
      ) {
        projectData.orderIndex -= 1;
      }
    }
  }

  await Transcript.updateOne(
    { _id: transcript._id },
    { projects: transcript.projects }
  );

  res.json(transcript);
});

const rearrangeNotepads = asyncHandler(async (req, res) => {
  const { draggingIndex, newIndex } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  let changingId;
  for (let notepadData of transcript.notepads) {
    if (notepadData.orderIndex === draggingIndex) {
      notepadData.orderIndex = newIndex;
      changingId = notepadData._id;
    }
  }
  if (draggingIndex > newIndex) {
    for (let notepadData of transcript.notepads) {
      if (
        notepadData.orderIndex >= newIndex &&
        notepadData.orderIndex <= draggingIndex &&
        notepadData._id !== changingId
      ) {
        notepadData.orderIndex += 1;
      }
    }
  } else {
    for (let notepadData of transcript.notepads) {
      if (
        notepadData.orderIndex <= newIndex &&
        notepadData.orderIndex >= draggingIndex &&
        notepadData._id !== changingId
      ) {
        notepadData.orderIndex -= 1;
      }
    }
  }

  await Transcript.updateOne(
    { _id: transcript._id },
    { notepads: transcript.notepads }
  );

  res.json(true);
});

const getMoreResources = asyncHandler(async (req, res) => {
  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  });

  let resources = [];
  await Promise.all(
    transcript.resources
      .sort(compare)
      .slice(9)
      .map(async (resourceObj) => {
        const resourceData = await Resource.findOne({
          user: req.user._id,
          subject: req.headers.subject,
          _id: resourceObj.resource,
        }).lean();
        resourceData.orderIndex = resourceObj.orderIndex;
        resources.push(resourceData);
      })
  );

  res.json(resources);
});

const insertText = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await TranscriptElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "TEXT" /*description?*/,
    text: "",
  });

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: materialId,
  });
  const transcriptElements = [
    ...transcript.transcriptElements.slice(0, index),
    newElement,
    ...transcript.transcriptElements.slice(index),
  ];

  await Transcript.updateOne(
    { user: req.user._id, subjectId: req.headers.subject, _id: materialId },
    { transcriptElements: transcriptElements }
  );

  res.json(newElement);
});

const insertImageUpload = asyncHandler(async (req, res) => {
  const file = req.file;

  let imageKey = mongoose.Types.ObjectId().toString();
  const isUploadSuccess = await uploadImage(file, imageKey);

  //if (isUploadSuccess) {
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: req.headers.elementid,
    type: "IMAGE",
    url: `https://primer-beta.s3.us-east-2.amazonaws.com/${imageKey}`, //ENV VARIABLE?
  });

  const transcript = await Transcript.findOne({
    _id: req.headers.materialid,
    user: req.user._id,
    subjectId: req.headers.subject,
  });
  const transcriptElements = [
    ...transcript.transcriptElements.slice(0, req.headers.index),
    newElement,
    ...transcript.transcriptElements.slice(req.headers.index),
  ];

  await Transcript.updateOne(
    {
      _id: req.headers.materialid,
      user: req.user._id,
      subjectId: req.headers.subject,
    },
    { transcriptElements: transcriptElements }
  );
  //}
  res.json(true);
});

const insertImageEmbed = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "IMAGE",
    url,
  });

  const transcript = await Transcript.findOne({ _id: materialId });
  const transcriptElements = [
    ...transcript.transcriptElements.slice(0, index),
    newElement,
    ...transcript.transcriptElements.slice(index),
  ];

  await Transcript.updateOne(
    { _id: materialId },
    { transcriptElements: transcriptElements }
  );

  res.json(newElement);
});

const insertVideo = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;
  const newElement = await TranscriptElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "VIDEO",
    url,
  });

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: materialId,
  });
  const transcriptElements = [
    ...transcript.transcriptElements.slice(0, index),
    newElement,
    ...transcript.transcriptElements.slice(index),
  ];

  await Transcript.updateOne(
    { user: req.user._id, subjectId: req.headers.subject, _id: materialId },
    { transcriptElements: transcriptElements }
  );

  res.json(newElement);
});

const insertLink = asyncHandler(async (req, res) => {
  const { index, title, url, materialId, elementId } = req.body;
  const newElement = await TranscriptElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "LINK",
    title,
    url,
  });

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: materialId,
  });
  const transcriptElements = [
    ...transcript.transcriptElements.slice(0, index),
    newElement,
    ...transcript.transcriptElements.slice(index),
  ];

  await Transcript.updateOne(
    { user: req.user._id, subjectId: req.headers.subject },
    { transcriptElements: transcriptElements }
  );

  res.json(newElement);
});

const insertDivider = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await TranscriptElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: materialId,
    type: "DIVIDER",
  });

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: materialId,
  });
  const transcriptElements = [
    ...transcript.transcriptElements.slice(0, index),
    newElement,
    ...transcript.transcriptElements.slice(index),
  ];

  await Transcript.updateOne(
    { user: req.user._id, subjectId: req.headers.subject },
    { transcriptElements: transcriptElements }
  );

  res.json(newElement);
});

const hideAccomplishment = asyncHandler(async (req, res) => {
  const { index } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  transcript.accomplishments = transcript.accomplishments.sort(compare);

  transcript.hiddenAccomplishments.push(transcript.accomplishments[index]._id);

  transcript.accomplishments = [
    ...transcript.accomplishments.slice(0, index),
    ...transcript.accomplishments.slice(index + 1),
  ];

  for (let accomplishmentData of transcript.accomplishments) {
    if (accomplishmentData.orderIndex > index) {
      accomplishmentData.orderIndex -= 1;
    }
  }

  await Transcript.updateOne(
    { _id: transcript._id },
    {
      accomplishments: transcript.accomplishments,
      hiddenAccomplishments: transcript.hiddenAccomplishments,
    }
  );

  res.json(transcript);
});

const hideResource = asyncHandler(async (req, res) => {
  const { index } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  transcript.resources = transcript.resources.sort(compare);

  transcript.hiddenResources.push(transcript.resources[index].resource);

  transcript.resources = [
    ...transcript.resources.slice(0, index),
    ...transcript.resources.slice(index + 1),
  ];

  for (let resourceData of transcript.resources) {
    if (resourceData.orderIndex > index) {
      resourceData.orderIndex -= 1;
    }
  }

  await Transcript.updateOne(
    { _id: transcript._id },
    {
      resources: transcript.resources,
      hiddenResources: transcript.hiddenResources,
    }
  );

  res.json(transcript);
});

const hideExercise = asyncHandler(async (req, res) => {
  const { index } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  transcript.exercises = transcript.exercises.sort(compare);

  transcript.hiddenExercises.push(transcript.exercises[index]._id);

  transcript.exercises = [
    ...transcript.exercises.slice(0, index),
    ...transcript.exercises.slice(index + 1),
  ];

  for (let exerciseData of transcript.exercises) {
    if (exerciseData.orderIndex > index) {
      exerciseData.orderIndex -= 1;
    }
  }

  await Transcript.updateOne(
    { _id: transcript._id },
    {
      exercises: transcript.exercises,
      hiddenExercises: transcript.hiddenExercises,
    }
  );

  res.json(transcript);
});

const hideProject = asyncHandler(async (req, res) => {
  const { index } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  transcript.projects = transcript.projects.sort(compare);

  transcript.hiddenProjects.push(transcript.projects[index]._id);

  transcript.projects = [
    ...transcript.projects.slice(0, index),
    ...transcript.projects.slice(index + 1),
  ];

  for (let projectData of transcript.projects) {
    if (projectData.orderIndex > index) {
      projectData.orderIndex -= 1;
    }
  }

  await Transcript.updateOne(
    { _id: transcript._id },
    { projects: transcript.projects, hiddenProjects: transcript.hiddenProjects }
  );

  res.json(transcript);
});

const hideNotepad = asyncHandler(async (req, res) => {
  const { index } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  transcript.notepads = transcript.notepads.sort(compare);

  transcript.hiddenNotepads.push(transcript.notepads[index]._id);

  transcript.notepads = [
    ...transcript.notepads.slice(0, index),
    ...transcript.notepads.slice(index + 1),
  ];

  for (let notepadData of transcript.notepads) {
    if (notepadData.orderIndex > index) {
      notepadData.orderIndex -= 1;
    }
  }

  await Transcript.updateOne(
    { _id: transcript._id },
    { notepads: transcript.notepads, hiddenNotepads: transcript.hiddenNotepads }
  );

  res.json(transcript);
});

const exposeExercise = asyncHandler(async (req, res) => {
  const { dragIndex, dropIndex, exerciseId } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  if (!dropIndex) {
    transcript.exercises.push({
      _id: transcript.hiddenExercises[dragIndex],
      orderIndex: transcript.exercises.length,
    });
    transcript.hiddenExercises = [
      ...transcript.hiddenExercises.slice(0, dragIndex),
      ...transcript.hiddenExercises.slice(dragIndex + 1),
    ];

    await Transcript.updateOne(
      { _id: transcript._id },
      {
        exercises: transcript.exercises,
        hiddenExercises: transcript.hiddenExercises,
      }
    );
  } else {
    //??????????????????????????????

    transcript.hiddenExercises.push(transcript.exercises[index]._id);

    for (let exerciseData of transcript.exercises) {
      if (exerciseData.orderIndex > index) {
        exerciseData.orderIndex -= 1;
      }
    }

    transcript.exercises = [
      ...transcript.exercises.slice(0, index),
      ...transcript.exercises.slice(index + 1),
    ];

    await Transcript.updateOne(
      { _id: transcript._id },
      {
        exercises: transcript.exercises,
        hiddenExercises: transcript.hiddenExercises,
      }
    );
  }
  res.json(transcript);
});

const exposeResource = asyncHandler(async (req, res) => {
  const { dragIndex, dropIndex, resourceId } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  if (!dropIndex) {
    transcript.resources.push({
      resource: transcript.hiddenResources[dragIndex],
      orderIndex: transcript.resources.length,
    });
    transcript.hiddenResources = [
      ...transcript.hiddenResources.slice(0, dragIndex),
      ...transcript.hiddenResources.slice(dragIndex + 1),
    ];

    await Transcript.updateOne(
      { _id: transcript._id },
      {
        resources: transcript.resources,
        hiddenResources: transcript.hiddenResources,
      }
    );
  } else {
    //??????????????????????????????

    transcript.hiddenResources.push(transcript.resources[index].resource);

    for (let resourceData of transcript.resources) {
      if (resourceData.orderIndex > index) {
        resourceData.orderIndex -= 1;
      }
    }

    transcript.resources = [
      ...transcript.resources.slice(0, index),
      ...transcript.resources.slice(index + 1),
    ];

    await Transcript.updateOne(
      { _id: transcript._id },
      {
        resources: transcript.resources,
        hiddenResources: transcript.hiddenResources,
      }
    );
  }
  res.json(transcript);
});

const exposeAccomplishment = asyncHandler(async (req, res) => {
  const { dragIndex, dropIndex, accomplishmentId } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  if (!dropIndex) {
    transcript.accomplishments.push({
      _id: transcript.hiddenAccomplishments[dragIndex],
      orderIndex: transcript.accomplishments.length,
    });
    transcript.hiddenAccomplishments = [
      ...transcript.hiddenAccomplishments.slice(0, dragIndex),
      ...transcript.hiddenAccomplishments.slice(dragIndex + 1),
    ];

    await Transcript.updateOne(
      { _id: transcript._id },
      {
        accomplishments: transcript.accomplishments,
        hiddenAccomplishments: transcript.hiddenAccomplishments,
      }
    );
  } else {
    //??????????????????????????????

    transcript.hiddenAccomplishments.push(
      transcript.accomplishments[index]._id
    );

    for (let accomplishmentData of transcript.accomplishments) {
      if (accomplishmentData.orderIndex > index) {
        accomplishmentData.orderIndex -= 1;
      }
    }

    transcript.accomplishments = [
      ...transcript.accomplishments.slice(0, index),
      ...transcript.accomplishments.slice(index + 1),
    ];

    await Transcript.updateOne(
      { _id: transcript._id },
      {
        accomplishments: transcript.accomplishments,
        hiddenAccomplishments: transcript.hiddenAccomplishments,
      }
    );
  }
  res.json(transcript);
});

const exposeProject = asyncHandler(async (req, res) => {
  const { dragIndex, dropIndex, projectId } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  if (!dropIndex) {
    transcript.projects.push({
      _id: transcript.hiddenProjects[dragIndex],
      orderIndex: transcript.projects.length,
    });
    transcript.hiddenProjects = [
      ...transcript.hiddenProjects.slice(0, dragIndex),
      ...transcript.hiddenProjects.slice(dragIndex + 1),
    ];

    await Transcript.updateOne(
      { _id: transcript._id },
      {
        projects: transcript.projects,
        hiddenProjects: transcript.hiddenProjects,
      }
    );
  } else {
    //??????????????????????????????

    transcript.hiddenProjects.push(transcript.projects[index]._id);

    for (let projectData of transcript.projects) {
      if (projectData.orderIndex > index) {
        projectData.orderIndex -= 1;
      }
    }

    transcript.projects = [
      ...transcript.projects.slice(0, index),
      ...transcript.projects.slice(index + 1),
    ];

    await Transcript.updateOne(
      { _id: transcript._id },
      {
        projects: transcript.projects,
        hiddenProjects: transcript.hiddenProjects,
      }
    );
  }
  res.json(transcript);
});

const exposeNotepad = asyncHandler(async (req, res) => {
  const { dragIndex } = req.body;

  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  }).lean();

  transcript.notepads.push({
    _id: transcript.hiddenNotepads[dragIndex],
    orderIndex: transcript.notepads.length,
  });
  transcript.hiddenNotepads = [
    ...transcript.hiddenNotepads.slice(0, dragIndex),
    ...transcript.hiddenNotepads.slice(dragIndex + 1),
  ];

  await Transcript.updateOne(
    { _id: transcript._id },
    {
      notepads: transcript.notepads,
      hiddenNotepads: transcript.hiddenNotepads,
    }
  );

  res.json(transcript);
});

const getHiddenAccomplishments = asyncHandler(async (req, res) => {
  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  });

  let accomplishmentsData = [];
  await Promise.all(
    transcript.hiddenAccomplishments.map(async (accomplishment) => {
      const accomplishmentData = await Goal.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: accomplishment._id,
        isRemoved: false,
      }).lean();

      if (accomplishmentData) {
        let resources = [];
        await Promise.all(
          accomplishmentData.resources.map(async (resource) => {
            resource = await Resource.findOne({
              user: req.user._id,
              subject: req.headers.subject,
              _id: resource,
            });
            resources.push(resource);
          })
        );
        accomplishmentData.resources = resources;

        let projects = [];
        await Promise.all(
          accomplishmentData.projects.map(async (project) => {
            project = await Project.findOne({
              user: req.user._id,
              subject: req.headers.subject,
              _id: project,
            });
            projects.push(project);
          })
        );
        accomplishmentData.projects = projects;

        let exercises = [];
        await Promise.all(
          accomplishmentData.exercises.map(async (exercise) => {
            exercise = await Exercise.findOne({
              user: req.user._id,
              subject: req.headers.subject,
              _id: exercise,
              isRemoved: false,
            });
            exercises.push(exercise);
          })
        );
        accomplishmentData.exercises = exercises;
      }

      accomplishmentData.orderIndex = accomplishment.orderIndex;

      accomplishmentsData.push(accomplishmentData);
    })
  );

  res.json(accomplishmentsData);
});

const getHiddenResources = asyncHandler(async (req, res) => {
  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  });

  let resources = [];
  await Promise.all(
    transcript.hiddenResources.map(async (resource) => {
      const resourceData = await Resource.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: resource,
      }).lean();
      resources.push(resourceData);
    })
  );

  res.json(resources);
});

const getHiddenExercises = asyncHandler(async (req, res) => {
  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  });

  let exercises = [];
  await Promise.all(
    transcript.hiddenExercises.map(async (exercise) => {
      const exerciseData = await Exercise.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: exercise,
        isRemoved: false,
      }).lean();
      exercises.push(exerciseData);
    })
  );

  res.json(exercises);
});

const getHiddenProjects = asyncHandler(async (req, res) => {
  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  });

  let projects = [];
  await Promise.all(
    transcript.hiddenProjects.map(async (project) => {
      const projectData = await Project.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: project,
        isRemoved: false,
      }).lean();
      if (projectData) {
        projects.push(projectData);
      }
    })
  );

  res.json(projects);
});

const getHiddenNotepads = asyncHandler(async (req, res) => {
  const transcript = await Transcript.findOne({
    user: req.user._id,
    subjectId: req.headers.subject,
  });

  let notepads = [];
  await Promise.all(
    transcript.hiddenNotepads.map(async (notepadId) => {
      const notepad = await Notepad.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: notepadId,
        isRemoved: false,
      }).lean();
      if (notepad) {
        if (notepad.resource) {
          notepad.resource = await Resource.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: notepad.resource,
          });
        } else if (notepad.project) {
          notepad.project = await Project.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: notepad.project,
          });
        } else if (notepad.exercise) {
          notepad.exercise = await Exercise.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: notepad.exercise,
          });
        }
      }

      notepads.push(notepad);
    })
  );

  res.json(notepads);
});

const editCaption = asyncHandler(async (req, res) => {
  const { caption, elementId, materialId } = req.body;

  const cleanCaption = sanitize(caption);

  await EditableElement.updateOne(
    { _id: elementId },
    { caption: cleanCaption }
  );

  //change -- definitely change
  const transcript = await Transcript.findOne({ _id: materialId }).lean();
  for (const element of transcript.transcriptElements) {
    if (element._id == elementId) {
      //oofff
      element.caption = cleanCaption;
    }
  }
  await Transcript.updateOne(
    { _id: materialId },
    { transcriptElements: transcript.transcriptElements }
  );

  res.json(true);
});

const removeElement = asyncHandler(async (req, res) => {
  await Transcript.updateOne(
    { user: req.user._id, subjectId: req.headers.subject },
    {
      $pull: {
        transcriptElements: {
          _id: mongoose.Types.ObjectId(req.headers.elementid),
        },
      },
    },
    { safe: true }
  );

  res.json(true);
});

const makePublic = asyncHandler(async (req, res) => {
  await Transcript.updateOne(
    { user: req.user._id, subjectId: req.headers.subject },
    { isPublic: true }
  );

  await Subject.updateOne({ _id: req.headers.subject }, { isPublic: true });

  res.status(201).end();
});

const makePrivate = asyncHandler(async (req, res) => {
  await Transcript.updateOne(
    { user: req.user._id, subjectId: req.headers.subject },
    { isPublic: false }
  );

  await Subject.updateOne({ _id: req.headers.subject }, { isPublic: false });

  res.status(201).end();
});

const getPublicTranscript = asyncHandler(async (req, res) => {
  const transcript = await Transcript.findOne(
    {
      _id: req.headers.transcriptid,
    },
    "-updatedAt -createdAt"
  ).lean();

  const userId = mongoose.Types.ObjectId(transcript.user);
  const subjectId = mongoose.Types.ObjectId(transcript.subjectId);

  if (transcript.isPublic) {
    const { name } = await User.findOne({ _id: userId }, "name");
    const subject = await Subject.findOne({ _id: subjectId }, "title");

    transcript.userInfo = { name, subject };

    let accomplishmentsData = [];
    await Promise.all(
      transcript.accomplishments.map(async (accomplishment) => {
        const accomplishmentData = await Goal.findOne(
          {
            user: userId,
            subject: subjectId,
            _id: accomplishment._id,
            isRemoved: false,
          },
          "-user -createdAt -updatedAt"
        ).lean();

        if (accomplishmentData) {
          let resources = [];
          await Promise.all(
            accomplishmentData.resources.map(async (resource) => {
              resource = await Resource.findOne(
                {
                  user: userId,
                  subject: subjectId,
                  _id: resource,
                },
                "-user -createdAt -updatedAt"
              );
              resources.push(resource);
            })
          );
          accomplishmentData.resources = resources;

          let projects = [];
          await Promise.all(
            accomplishmentData.projects.map(async (project) => {
              project = await Project.findOne(
                {
                  user: userId,
                  subject: subjectId,
                  _id: project,
                  isRemoved: false,
                },
                "-user -createdAt -updatedAt"
              );
              projects.push(project);
            })
          );
          accomplishmentData.projects = projects;

          let exercises = [];
          await Promise.all(
            accomplishmentData.exercises.map(async (exercise) => {
              exercise = await Exercise.findOne(
                {
                  user: userId,
                  subject: subjectId,
                  _id: exercise,
                  isRemoved: false,
                },
                "-user -createdAt -updatedAt"
              );
              exercises.push(exercise);
            })
          );
          accomplishmentData.exercises = exercises;

          //Not the best way tot this, we're grabbing goals more than once.
          let subgoals = [];

          await Promise.all(
            accomplishmentData.subgoals.map(async (subgoal) => {
              subgoal = await getSubgoal(subgoal, userId, subjectId, 0);
              subgoals.push(subgoal);
            })
          );
          accomplishmentData.subgoals = subgoals;

          accomplishmentData.orderIndex = accomplishment.orderIndex;

          accomplishmentsData.push(accomplishmentData);
        }
      })
    );

    transcript.accomplishments = accomplishmentsData;

    let projectsData = [];
    await Promise.all(
      transcript.projects.sort(compare).map(async (project) => {
        const projectData = await Project.findOne(
          {
            user: userId,
            subject: subjectId,
            _id: project._id,
            isRemoved: false,
          },
          "-user -createdAt -updatedAt"
        ).lean();
        if (projectData) {
          projectData.orderIndex = project.orderIndex;
          projectsData.push(projectData);
        }
      })
    );

    transcript.projects = projectsData;

    let resourcesData = [];
    await Promise.all(
      transcript.resources.sort(compare).map(async (resourceObj) => {
        const resourceData = await Resource.findOne(
          {
            user: userId,
            subject: subjectId,
            _id: resourceObj.resource,
          },
          "-user -createdAt -updatedAt"
        ).lean();
        if (resourceData) {
          resourceData.orderIndex = resourceObj.orderIndex;
          resourcesData.push(resourceData);
        }
      })
    );

    transcript.resources = resourcesData;

    let exercisesData = [];
    await Promise.all(
      transcript.exercises.sort(compare).map(async (exercise) => {
        const exerciseData = await Exercise.findOne(
          {
            user: userId,
            subject: subjectId,
            _id: exercise._id,
            isRemoved: false,
          },
          "-user -createdAt -updatedAt"
        ).lean();
        if (exerciseData) {
          exerciseData.orderIndex = exercise.orderIndex;
        }
        exercisesData.push(exerciseData);
      })
    );

    transcript.exercises = exercisesData;

    let notepadsData = [];
    await Promise.all(
      transcript.notepads.map(async (notepad) => {
        let notepadData = await Notepad.findOne(
          {
            user: userId,
            subject: subjectId,
            _id: notepad._id,
            isRemoved: false,
          },
          "-user -createdAt -updatedAt"
        ).lean();

        if (notepadData) {
          notepadData.orderIndex = notepad.orderIndex;

          if (notepadData.resource) {
            notepadData.resource = await Resource.findOne(
              {
                user: userId,
                subject: subjectId,
                _id: notepadData.resource,
              },
              "-user -createdAt -updatedAt"
            );
          } else if (notepadData.project) {
            notepadData.project = await Project.findOne(
              {
                user: userId,
                subject: subjectId,
                _id: notepadData.project,
              },
              "-user -createdAt -updatedAt"
            );
          } else if (notepadData.exercise) {
            notepadData.exercise = await Exercise.findOne(
              {
                user: userId,
                subject: subjectId,
                _id: notepadData.exercise,
              },
              "-user -createdAt -updatedAt"
            );
          }
          notepadsData.push(notepadData);
        }
      })
    );

    transcript.notepads = notepadsData;

    transcript.timeline = {};
    transcript.timeline.types = [];

    const quarters = await Quarters.find(
      {
        user: userId,
        subject: subjectId,
        "goals.0": { $exists: true },
      },
      "-user -createdAt -updatedAt"
    ).lean();

    await getTimelineUnitData(quarters, "quarter", userId, subjectId);

    transcript.timeline.quarters = quarters;
    quarters.length > 0 && transcript.timeline.types.push("quarters");

    //let monthsData = [];
    const months = await Months.find(
      {
        user: userId,
        subject: subjectId,
        "goals.0": { $exists: true },
      },
      "-user -createdAt -updatedAt"
    ).lean();

    await getTimelineUnitData(months, "month", userId, subjectId);

    transcript.timeline.months = months;
    months.length > 0 && transcript.timeline.types.push("months");

    let weeksData = [];
    const weeks = await Weeks.find(
      {
        user: userId,
        subject: subjectId,
        "goals.0": { $exists: true },
      },
      "-user -createdAt -updatedAt"
    ).lean();

    //should be a function
    await Promise.all(
      weeks.map(async (weekData) => {
        let weekGoals = [];
        let weekProjects = [];
        let weekBooks = [];
        let weekExercises = [];
        await Promise.all(
          weekData.goals.map(async (goalId) => {
            const goal = await Goal.findOne(
              {
                user: userId,
                subject: subjectId,
                _id: goalId,
                isRemoved: false,
              },
              "-user -createdAt -updatedAt"
            );
            if (goal) {
              weekGoals.push(goal);

              let resources = [];
              await Promise.all(
                goal.resources.map(async (resourceId) => {
                  let resource = await Resource.findOne(
                    {
                      user: userId,
                      subject: subjectId,
                      _id: resourceId,
                    },
                    "-user -createdAt -updatedAt"
                  );
                  resources.push(resource);
                  weekBooks.push(resource);
                })
              );
              goal.resources = resources;

              let projects = [];
              await Promise.all(
                goal.projects.map(async (projectId) => {
                  let project = await Project.findOne(
                    {
                      user: userId,
                      subject: subjectId,
                      _id: projectId,
                      // isRemoved: false,
                    },
                    "-user -createdAt -updatedAt"
                  );
                  projects.push(project);
                  weekProjects.push(project);
                })
              );
              goal.projects = projects;

              let exercises = [];
              await Promise.all(
                goal.exercises.map(async (exerciseId) => {
                  let exercise = await Exercise.findOne(
                    {
                      user: userId,
                      subject: subjectId,
                      _id: exerciseId,
                      isRemoved: false,
                    },
                    "-user -createdAt -updatedAt"
                  );
                  exercises.push(exercise);
                  weekExercises.push(exercise);
                })
              );

              goal.exercises = exercises;
            }
          })
        );

        weekData.goals = weekGoals;
        weekData.projects = weekProjects;
        weekData.books = weekBooks;
        weekData.exercises = weekExercises;

        weeksData.push(weekData);
      })
    );

    transcript.timeline.weeks = weeksData;
    weeksData.length > 0 && transcript.timeline.types.push("weeks");

    let daysData = [];

    const days = await Days.find({
      user: userId,
      subject: subjectId,
      "goals.0": { $exists: true },
    }).lean();

    //should be a function
    await Promise.all(
      days.map(async (dayData) => {
        let dayGoals = [];
        let dayProjects = [];
        let dayBooks = [];
        let dayExercises = [];
        await Promise.all(
          dayData.goals.map(async (goalId) => {
            const goal = await Goal.findOne(
              {
                user: userId,
                subject: subjectId,
                _id: goalId,
                isRemoved: false,
              },
              "-user -createdAt -updatedAt"
            );
            if (goal) {
              dayGoals.push(goal);

              let resources = [];
              await Promise.all(
                goal.resources.map(async (resourceId) => {
                  let resource = await Resource.findOne({
                    user: userId,
                    subject: subjectId,
                    _id: resourceId,
                  }).select("-user");
                  resources.push(resource);
                  dayBooks.push(resource);
                }, "-user -createdAt -updatedAt")
              );
              goal.resources = resources;

              let projects = [];
              await Promise.all(
                goal.projects.map(async (projectId) => {
                  let project = await Project.findOne(
                    {
                      user: userId,
                      subject: subjectId,
                      _id: projectId,
                      isRemoved: false,
                    },
                    "-user -createdAt -updatedAt"
                  );
                  projects.push(project);
                  dayProjects.push(project);
                })
              );
              goal.projects = projects;

              let exercises = [];
              await Promise.all(
                goal.exercises.map(async (exerciseId) => {
                  let exercise = await Exercise.findOne(
                    {
                      user: userId,
                      subject: subjectId,
                      _id: exerciseId,
                      isRemoved: false,
                    },
                    "-user -createdAt -updatedAt"
                  );
                  exercises.push(exercise);
                  dayExercises.push(exercise);
                })
              );

              goal.exercises = exercises;
            }
          })
        );

        dayData.goals = dayGoals;
        dayData.projects = dayProjects;
        dayData.books = dayBooks;
        dayData.exercises = dayExercises;
        daysData.push(dayData);
      })
    );

    transcript.timeline.days = daysData;
    daysData.length > 0 && transcript.timeline.types.push("days");

    transcript.timeline.types.reverse();

    delete transcript.user;
    //delete transcript.

    res.json(transcript);
  } else {
    res.json({ isPublic: false });
  }
});

export {
  getTranscript,
  editTranscriptTextData,
  rearrangeAccomplishments,
  rearrangeResources,
  rearrangeExercises,
  rearrangeProjects,
  rearrangeNotepads,
  getMoreResources,
  insertText,
  insertImageUpload,
  insertImageEmbed,
  insertVideo,
  insertLink,
  insertDivider,
  editText,
  hideAccomplishment,
  hideResource,
  hideExercise,
  hideProject,
  hideNotepad,
  exposeAccomplishment,
  exposeResource,
  exposeExercise,
  exposeProject,
  exposeNotepad,
  getHiddenAccomplishments,
  getHiddenResources,
  getHiddenExercises,
  getHiddenProjects,
  getHiddenNotepads,
  editCaption,
  removeElement,
  makePublic,
  makePrivate,
  getPublicTranscript,
};
