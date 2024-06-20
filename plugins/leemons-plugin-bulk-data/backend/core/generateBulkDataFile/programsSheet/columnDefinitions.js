const GROUP_TITLES = {
  creditsAndDurationConfig: {
    title: 'Credits & Duration config',
    style: {
      bgColor: 'blue',
      fontColor: 'white',
    },
  },
  coursesConfig: {
    title: 'Courses config',
    style: {
      bgColor: 'red',
      fontColor: 'white',
    },
  },
  subjectTypesConfig: {
    title: 'Subject Types config',
    style: {
      bgColor: 'green',
      fontColor: 'white',
    },
  },
  knowledgeAreasConfig: {
    title: 'Knowledge Areas config',
    style: {
      bgColor: 'blue',
      fontColor: 'white',
    },
  },
  referenceGroupsConfig: {
    title: 'Reference Groups config',
    style: {
      bgColor: 'yellow',
      fontColor: 'black',
    },
  },
  otherOptions: {
    title: 'Other options',
    style: {
      bgColor: 'purple',
      fontColor: 'white',
    },
  },
};

const PROGRAM_COLUMN_DEFINITIONS = {
  root: {
    title: 'Root',
    width: 15,
    style: { fontColor: 'white', bgColor: 'black' },
  },
  name: { title: 'Name', width: 20 },
  abbreviation: { title: 'Abbreviation', width: 10 },
  color: { title: 'Color', width: 10 },
  image: { title: 'Cover', width: 10 },
  creator: { title: 'Creator', width: 10 },
  centers: { title: 'Centers', width: 10 },
  evaluationSystem: { title: 'Evaluation System', width: 10 },
  creditSystem: {
    title: 'Use credit System',
    width: 10,
    groupTitle: GROUP_TITLES.creditsAndDurationConfig,
  },
  credits: {
    title: 'Total credits',
    width: 10,
    groupTitle: GROUP_TITLES.creditsAndDurationConfig,
  },
  hoursPerCredit: {
    title: 'Hours per Credit',
    width: 10,
    groupTitle: GROUP_TITLES.creditsAndDurationConfig,
  },
  totalHours: {
    title: 'Total Hours',
    width: 10,
    groupTitle: GROUP_TITLES.creditsAndDurationConfig,
    note: "Don't put any value here if a credit system is being used. Total hours will be computed automatically.",
  },
  maxNumberOfCourses: {
    title: 'Number of Courses',
    width: 10,
    style: { bgColor: 'lightRed' },
    groupTitle: GROUP_TITLES.coursesConfig,
  },
  coursesOffset: {
    title: 'Courses Offset',
    width: 10,
    style: { bgColor: 'lightRed' },
    groupTitle: GROUP_TITLES.coursesConfig,
  },
  courseCredits: {
    title: 'Min & Max Credits per Course',
    width: 30,
    style: { bgColor: 'lightRed' },
    groupTitle: GROUP_TITLES.coursesConfig,
  },
  sequentialCourses: {
    title: 'Sequential Courses',
    width: 10,
    style: { bgColor: 'lightRed' },
    note: 'Programs with a single course are considered sequential.',
    groupTitle: GROUP_TITLES.coursesConfig,
  },
  seatsPerCourse: {
    title: 'Seats per Course',
    width: 30,
    style: { bgColor: 'lightRed' },
    note: 'Only needed/used when the program uses reference groups.',
    groupTitle: GROUP_TITLES.coursesConfig,
  },
  cycles: {
    title: 'Cycles',
    width: 30,
    style: { bgColor: 'lightRed' },
    note: "When cycles courses don't match program courses, there will be an error.",
    groupTitle: GROUP_TITLES.coursesConfig,
  },
  substages: {
    title: 'Substages',
    width: 30,
    style: { bgColor: 'lightRed' },
    groupTitle: GROUP_TITLES.coursesConfig,
  },
  haveKnowledge: {
    title: 'Does it have Knowledge Areas',
    width: 10,
    groupTitle: GROUP_TITLES.knowledgeAreasConfig,
  },
  hasSubjectTypes: {
    title: 'Does it have Subject Types',
    width: 10,
    style: { bgColor: 'lightGreen' },
    groupTitle: GROUP_TITLES.subjectTypesConfig,
  },
  referenceGroups: {
    title: 'Does it have reference Groups',
    width: 10,
    style: { bgColor: 'lightYellow' },
    groupTitle: GROUP_TITLES.referenceGroupsConfig,
  },
  groupsPerCourse: {
    title: 'Groups per Course',
    width: 30,
    style: { bgColor: 'lightYellow' },
    groupTitle: GROUP_TITLES.referenceGroupsConfig,
    note: 'IMPORTANT! Specify the number of groups per course, even when there is only one course: 1:2, 2:3, etc.\nOnly in cases of programs with NON-sequential courses, INDICATE A SINGLE VALUE, e.g.: 3',
  },
  nameFormat: {
    title: 'Name Format',
    width: 10,
    style: { bgColor: 'lightYellow' },
    groupTitle: GROUP_TITLES.referenceGroupsConfig,
  },
  prefix: {
    title: 'Prefix',
    width: 10,
    style: { bgColor: 'lightYellow' },
    groupTitle: GROUP_TITLES.referenceGroupsConfig,
    note: 'A prefixed value for the formatted generic name we set. If empty, no prefix is added.',
  },
  digits: {
    title: 'Digits',
    width: 10,
    style: { bgColor: 'lightYellow' },
    groupTitle: GROUP_TITLES.referenceGroupsConfig,
    note: 'Only valid when nameFormat is digits.',
  },
  hideStudentsToStudents: {
    title: 'Hide Students to Students',
    width: 10,
    groupTitle: GROUP_TITLES.otherOptions,
  },
  useAutoAssignment: {
    title: 'Use Auto Assignment',
    width: 10,
    groupTitle: GROUP_TITLES.otherOptions,
  },
  useCustomSubjectIds: {
    title: 'Use Custom Subject IDs',
    width: 10,
    groupTitle: GROUP_TITLES.otherOptions,
  },
};

Object.keys(PROGRAM_COLUMN_DEFINITIONS).forEach((key) => {
  if (!PROGRAM_COLUMN_DEFINITIONS[key].style) {
    PROGRAM_COLUMN_DEFINITIONS[key].style = { bgColor: 'lightBlue' };
  }
});

module.exports = { PROGRAM_COLUMN_DEFINITIONS };
