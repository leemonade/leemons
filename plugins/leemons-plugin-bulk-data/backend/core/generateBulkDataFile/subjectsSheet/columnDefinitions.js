const GROUP_TITLES = {
  classesConfiguration: {
    title: 'Classes Configuration',
    style: {
      bgColor: 'blue',
      fontColor: 'white',
    },
  },
  enrollment: {
    title: 'Enrollment',
    style: {
      bgColor: 'red',
      fontColor: 'white',
    },
  },
  timetable: {
    title: 'Timetable',
    style: {
      bgColor: 'green',
      fontColor: 'white',
    },
  },
};

const SUBJECT_COLUMN_DEFINITIONS = {
  root: {
    title: 'Root',
    width: 15,
    style: { fontColor: 'white', bgColor: 'black' },
  },
  name: { title: 'Name', width: 20 },
  program: { title: 'Program', width: 10 },
  creator: { title: 'Creator', width: 10 },
  internalId: {
    title: 'Internal ID',
    width: 10,
    note: 'Unique subject ID per program of 3 digits.',
  },
  color: { title: 'Color', width: 10 },
  image: { title: 'Cover', width: 10 },
  icon: { title: 'Icon', width: 10 },
  knowledgeArea: {
    title: 'Knowledge Area',
    width: 10,
    note: 'The KA must belong to the same center as the program.\nIf the program does not use KAs, leave it blank.',
  },
  subjectType: {
    title: 'Subject Type',
    width: 10,
    note: 'The subject type must belong to the same center as the program.',
  },
  substage: {
    title: 'Substage',
    width: 10,
    note: 'Reference the ABBREVIATION of the substage defined in the ap_programs tab.\nUse only one, or leave the field blank if the subject is offered throughout the whole course.',
  },
  courses: {
    title: 'Courses',
    width: 10,
    note: "Indicate the course index where the subject is offered. If it's offered in more than a course, separate the course indexes with the '|' character: e.g.: 1|2|3.\nA subject can have more than one course ONLY when the courses of the program are not sequential.",
  },
  credits: {
    title: 'Credits',
    width: 10,
    note: "Don't fill if the program does not use credits. If it does, the number of credits should be greater than 0.",
  },
  groupsAmount: {
    title: 'Groups Amount',
    width: 10,
    style: { bgColor: 'lightBlue' },
    groupTitle: GROUP_TITLES.classesConfiguration,
    note: 'The number of groups must be equal or less than the groups corresponding to the course or the total number of groups in programs with a single course or non-sequential courses. (Configured in ap_programs)',
  },
  classrooms: {
    title: 'Classrooms Info',
    width: 50,
    style: { bgColor: 'lightBlue' },
    groupTitle: GROUP_TITLES.classesConfiguration,
    note: '- For subjects that do not use group reference (either because the program does not have them or because the user indicates it)\n- Specify the seats by classroom (required): 1:10, 2:18, 3:20\n- Optionally, specify an alias for the classroom: 1:10@MyAlias\n- The user can add an unlimited number of classrooms, separated by commas',
  },
  classesCustomIds: {
    title: 'Classes Custom IDs',
    width: 50,
    style: { bgColor: 'lightBlue' },
    groupTitle: GROUP_TITLES.classesConfiguration,
    note: 'Id of the class that the user assigns to a classroom. (optional)\nFORMAT: classIndex:id => 1:math-1-b\nAMOUNT: Less or equal to the amount of defined groups/classrooms',
  },
  teachers: {
    title: 'Teachers',
    width: 20,
    style: { bgColor: 'lightRed' },
    groupTitle: GROUP_TITLES.enrollment,
    note: 'Careful with the center in which the user is registered. It must match the center of the program for which the subject is being created.',
  },
  students: {
    title: 'Students',
    width: 80,
    style: { bgColor: 'lightRed' },
    groupTitle: GROUP_TITLES.enrollment,
    note: 'Careful with the center in which the user is registered. It must match the center of the program for which the subject is being created.',
  },
  timetable0: {
    title: 'Sunday',
    width: 50,
    style: { bgColor: 'lightGreen' },
    groupTitle: GROUP_TITLES.timetable,
  },
  timetable1: {
    title: 'Monday',
    width: 50,
    style: { bgColor: 'lightGreen' },
    groupTitle: GROUP_TITLES.timetable,
  },
  timetable2: {
    title: 'Tuesday',
    width: 50,
    style: { bgColor: 'lightGreen' },
    groupTitle: GROUP_TITLES.timetable,
  },
  timetable3: {
    title: 'Wednesday',
    width: 50,
    style: { bgColor: 'lightGreen' },
    groupTitle: GROUP_TITLES.timetable,
  },
  timetable4: {
    title: 'Thursday',
    width: 50,
    style: { bgColor: 'lightGreen' },
    groupTitle: GROUP_TITLES.timetable,
  },
  timetable5: {
    title: 'Friday',
    width: 50,
    style: { bgColor: 'lightGreen' },
    groupTitle: GROUP_TITLES.timetable,
  },
  timetable6: {
    title: 'Saturday',
    width: 50,
    style: { bgColor: 'lightGreen' },
    groupTitle: GROUP_TITLES.timetable,
  },
};

Object.keys(SUBJECT_COLUMN_DEFINITIONS).forEach((key) => {
  if (!SUBJECT_COLUMN_DEFINITIONS[key].style) {
    SUBJECT_COLUMN_DEFINITIONS[key].style = { bgColor: 'lightBlue' };
  }
});

const modifyColumnHeaders = (worksheet) => {
  worksheet.getRow(1).eachCell((cell) => {
    if (cell.value?.startsWith('timetable')) {
      const parts = cell.value.split('timetable');
      // eslint-disable-next-line no-param-reassign
      cell.value = `timetable.${parts[1]}`;
    }
  });
};

module.exports = { SUBJECT_COLUMN_DEFINITIONS, modifyColumnHeaders };
