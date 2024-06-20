const GROUP_TITLE_GROUPS = {
  permissions: {
    preventKeyPrefixing: true,
    title: 'Plugin Permissions',
    style: {
      bgColor: 'black',
      fontColor: 'white',
    },
  },
};

const GROUP_TITLES = {
  users: {
    title: 'Users',
    style: {
      bgColor: 'blue',
      fontColor: 'white',
    },
    key: 'users',
  },
  dataset: {
    title: 'Dataset',
    style: {
      bgColor: 'red',
      fontColor: 'white',
    },
    key: 'dataset',
  },
  calendar: {
    title: 'Calendar',
    style: {
      bgColor: 'green',
      fontColor: 'white',
    },
    key: 'calendar',
  },
  academicPortfolio: {
    title: 'Academic Portfolio',
    style: {
      bgColor: 'yellow',
      fontColor: 'black',
    },
    key: 'academic-portfolio',
  },
  timetable: {
    title: 'Timetable',
    style: {
      bgColor: 'blue',
      fontColor: 'white',
    },
    key: 'timetable',
  },
  tasks: {
    title: 'Tasks',
    style: {
      bgColor: 'red',
      fontColor: 'white',
    },
    key: 'tasks',
  },
  curriculum: {
    title: 'Curriculum',
    style: {
      bgColor: 'green',
      fontColor: 'white',
    },
    key: 'curriculum',
  },
  leebrary: {
    title: 'Leebrary',
    style: {
      bgColor: 'yellow',
      fontColor: 'black',
    },
    key: 'leebrary',
  },
  grades: {
    title: 'Grades',
    style: {
      bgColor: 'blue',
      fontColor: 'white',
    },
    key: 'grades',
  },
  tests: {
    title: 'Tests',
    style: {
      bgColor: 'red',
      fontColor: 'white',
    },
    key: 'tests',
  },
  assignables: {
    title: 'Assignables',
    style: {
      bgColor: 'green',
      fontColor: 'white',
    },
    key: 'assignables',
  },
  admin: {
    title: 'Admin',
    style: {
      bgColor: 'yellow',
      fontColor: 'black',
    },
    key: 'admin',
  },
  scores: {
    title: 'Scores',
    style: {
      bgColor: 'blue',
      fontColor: 'white',
    },
    key: 'scores',
  },
  academicCalendar: {
    title: 'Academic Calendar',
    style: {
      bgColor: 'red',
      fontColor: 'white',
    },
    key: 'academic-calendar',
  },
  families: {
    title: 'Families',
    style: {
      bgColor: 'green',
      fontColor: 'white',
    },
    key: 'families',
  },
  feedback: {
    title: 'Feedback',
    style: {
      bgColor: 'yellow',
      fontColor: 'black',
    },
    key: 'feedback',
  },
  contentCreator: {
    title: 'Content Creator',
    style: {
      bgColor: 'blue',
      fontColor: 'white',
    },
    key: 'content-creator',
  },
  comunica: {
    title: 'Comunica',
    style: {
      bgColor: 'red',
      fontColor: 'white',
    },
    key: 'comunica',
  },
};

// Add the groupTitle to the all GROUP_TITLES
Object.keys(GROUP_TITLES).forEach((key) => {
  GROUP_TITLES[key].groupTitle = GROUP_TITLE_GROUPS.permissions;
});

const PLUGIN_COLUMN_DEFINITIONS = {
  usersUsers: {
    title: 'Users',
    width: 10,
    groupTitle: GROUP_TITLES.users,
    style: { bgColor: 'lightBlue' },
    key: 'users',
  },
  usersUserData: {
    title: 'User Data',
    width: 10,
    groupTitle: GROUP_TITLES.users,
    style: { bgColor: 'lightBlue' },
    key: 'user-data',
  },
  usersCenters: {
    title: 'Centers',
    width: 10,
    groupTitle: GROUP_TITLES.users,
    style: { bgColor: 'lightBlue' },
    key: 'centers',
  },
  usersProfiles: {
    title: 'Profiles',
    width: 10,
    groupTitle: GROUP_TITLES.users,
    style: { bgColor: 'lightBlue' },
    key: 'profiles',
  },
  datasetDataset: {
    title: 'Dataset',
    width: 10,
    groupTitle: GROUP_TITLES.dataset,
    style: { bgColor: 'lightRed' },
    key: 'dataset',
  },
  calendarCalendar: {
    title: 'Calendar',
    key: 'calendar',
    groupTitle: GROUP_TITLES.calendar,
    style: { bgColor: 'lightGreen' },
  },
  calendarMenuKanban: {
    title: 'Menu Kanban',
    key: 'menu.kanban',
    groupTitle: GROUP_TITLES.calendar,
    style: { bgColor: 'lightGreen' },
  },
  academicPortfolioPortfolio: {
    title: 'Portfolio',
    key: 'portfolio',
    groupTitle: GROUP_TITLES.academicPortfolio,
    style: { bgColor: 'lightYellow' },
  },
  academicPortfolioPrograms: {
    title: 'Programs',
    key: 'programs',
    groupTitle: GROUP_TITLES.academicPortfolio,
    style: { bgColor: 'lightYellow' },
  },
  academicPortfolioProfiles: {
    title: 'Profiles',
    key: 'profiles',
    groupTitle: GROUP_TITLES.academicPortfolio,
    style: { bgColor: 'lightYellow' },
  },
  academicPortfolioSubjects: {
    title: 'Subjects',
    key: 'subjects',
    groupTitle: GROUP_TITLES.academicPortfolio,
    style: { bgColor: 'lightYellow' },
  },
  academicPortfolioTree: {
    title: 'Tree',
    key: 'tree',
    groupTitle: GROUP_TITLES.academicPortfolio,
    style: { bgColor: 'lightYellow' },
  },
  timetableConfig: {
    title: 'Config',
    key: 'config',
    groupTitle: GROUP_TITLES.timetable,
    style: { bgColor: 'lightBlue' },
  },
  timetableTimetable: {
    title: 'Timetable',
    key: 'timetable',
    groupTitle: GROUP_TITLES.timetable,
    style: { bgColor: 'lightBlue' },
  },
  tasksTasks: {
    title: 'Tasks',
    key: 'tasks',
    groupTitle: GROUP_TITLES.tasks,
    style: { bgColor: 'lightRed' },
  },
  tasksLibrary: {
    title: 'Library',
    key: 'library',
    groupTitle: GROUP_TITLES.tasks,
    style: { bgColor: 'lightRed' },
  },
  tasksProfiles: {
    title: 'Profiles',
    key: 'profiles',
    groupTitle: GROUP_TITLES.tasks,
    style: { bgColor: 'lightRed' },
  },
  curriculumCurriculum: {
    title: 'Curriculum',
    key: 'curriculum',
    groupTitle: GROUP_TITLES.curriculum,
    style: { bgColor: 'lightGreen' },
  },
  curriculumCurriculumMenu: {
    title: 'Curriculum Menu',
    key: 'curriculum-menu',
    groupTitle: GROUP_TITLES.curriculum,
    style: { bgColor: 'lightGreen' },
  },
  leebraryLibrary: {
    title: 'Library',
    key: 'library',
    groupTitle: GROUP_TITLES.leebrary,
    style: { bgColor: 'lightYellow' },
  },
  gradesRules: {
    title: 'Rules',
    key: 'rules',
    groupTitle: GROUP_TITLES.grades,
    style: { bgColor: 'lightBlue' },
  },
  gradesEvaluations: {
    title: 'Evaluations',
    key: 'evaluations',
    groupTitle: GROUP_TITLES.grades,
    style: { bgColor: 'lightBlue' },
  },
  gradesPromotions: {
    title: 'Promotions',
    key: 'promotions',
    groupTitle: GROUP_TITLES.grades,
    style: { bgColor: 'lightBlue' },
  },
  gradesDependencies: {
    title: 'Dependencies',
    key: 'dependencies',
    groupTitle: GROUP_TITLES.grades,
    style: { bgColor: 'lightBlue' },
  },
  testsTests: {
    title: 'Tests',
    key: 'tests',
    groupTitle: GROUP_TITLES.tests,
    style: { bgColor: 'lightRed' },
  },
  testsQuestionsBanks: {
    title: 'Questions Banks',
    key: 'questionsBanks',
    groupTitle: GROUP_TITLES.tests,
    style: { bgColor: 'lightRed' },
  },
  assignablesActivities: {
    title: 'Activities',
    key: 'activities',
    groupTitle: GROUP_TITLES.assignables,
    style: { bgColor: 'lightGreen' },
  },
  assignablesOngoing: {
    title: 'Ongoing',
    key: 'ongoing',
    groupTitle: GROUP_TITLES.assignables,
    style: { bgColor: 'lightGreen' },
  },
  assignablesHistory: {
    title: 'History',
    key: 'history',
    groupTitle: GROUP_TITLES.assignables,
    style: { bgColor: 'lightGreen' },
  },
  adminSetup: {
    title: 'Setup',
    key: 'setup',
    groupTitle: GROUP_TITLES.admin,
    style: { bgColor: 'lightYellow' },
  },
  scoresScores: {
    title: 'Scores',
    key: 'scores',
    groupTitle: GROUP_TITLES.scores,
    style: { bgColor: 'lightBlue' },
  },
  scoresPeriods: {
    title: 'Periods',
    key: 'periods',
    groupTitle: GROUP_TITLES.scores,
    style: { bgColor: 'lightBlue' },
  },
  scoresScoresMenu: {
    title: 'Scores Menu',
    key: 'scoresMenu',
    groupTitle: GROUP_TITLES.scores,
    style: { bgColor: 'lightBlue' },
  },
  scoresNotebook: {
    title: 'Notebook',
    key: 'notebook',
    groupTitle: GROUP_TITLES.scores,
    style: { bgColor: 'lightBlue' },
  },
  scoresReviewer: {
    title: 'Reviewer',
    key: 'reviewer',
    groupTitle: GROUP_TITLES.scores,
    style: { bgColor: 'lightBlue' },
  },
  academicCalendarConfig: {
    title: 'Config',
    key: 'config',
    groupTitle: GROUP_TITLES.academicCalendar,
    style: { bgColor: 'lightRed' },
  },
  familiesFamilies: {
    title: 'Families',
    key: 'families',
    groupTitle: GROUP_TITLES.families,
    style: { bgColor: 'lightGreen' },
  },
  familiesConfig: {
    title: 'Config',
    key: 'config',
    groupTitle: GROUP_TITLES.families,
    style: { bgColor: 'lightGreen' },
  },
  familiesFamiliesBasicInfo: {
    title: 'Families Basic Info',
    key: 'families-basic-info',
    groupTitle: GROUP_TITLES.families,
    style: { bgColor: 'lightGreen' },
  },
  familiesFamiliesCustomInfo: {
    title: 'Families Custom Info',
    key: 'families-custom-info',
    groupTitle: GROUP_TITLES.families,
    style: { bgColor: 'lightGreen' },
  },
  familiesFamiliesGuardiansInfo: {
    title: 'Families Guardians Info',
    key: 'families-guardians-info',
    groupTitle: GROUP_TITLES.families,
    style: { bgColor: 'lightGreen' },
  },
  familiesFamiliesStudentsInfo: {
    title: 'Families Students Info',
    key: 'families-students-info',
    groupTitle: GROUP_TITLES.families,
    style: { bgColor: 'lightGreen' },
  },
  feedbackFeedback: {
    title: 'Feedback',
    key: 'feedback',
    groupTitle: GROUP_TITLES.feedback,
    style: { bgColor: 'lightYellow' },
  },
  contentCreatorCreator: {
    title: 'Creator',
    key: 'creator',
    groupTitle: GROUP_TITLES.contentCreator,
    style: { bgColor: 'lightBlue' },
  },
  comunicaConfig: {
    title: 'Config',
    key: 'config',
    groupTitle: GROUP_TITLES.comunica,
    style: { bgColor: 'lightRed' },
  },
};

const SIMPLE_COLUMN_DEFINITIONS = {
  root: {
    title: 'Root',
    width: 15,
    style: { fontColor: 'white', bgColor: 'black' },
  },
  name: { title: 'Name', width: 20 },
  description: { title: 'Description', width: 20 },
  indexable: { title: 'Indexable', width: 20 },
  accessTo: { title: 'Can access to', width: 20 },
};

Object.keys(SIMPLE_COLUMN_DEFINITIONS).forEach((key) => {
  if (!SIMPLE_COLUMN_DEFINITIONS[key].style) {
    SIMPLE_COLUMN_DEFINITIONS[key].style = { bgColor: 'lightBlue' };
  }
});

const computeHeaderValues = (worksheet) => {
  const offset = Object.keys(SIMPLE_COLUMN_DEFINITIONS).length;
  const headerRow = 1;
  const formulaRows = { baseRow: 3, offsetRow: 5 };
  const groupRanges = {};

  Object.entries(PLUGIN_COLUMN_DEFINITIONS).forEach(([, { groupTitle }], index) => {
    if (groupTitle) {
      const adjustedIndex = index + 1 + offset;
      if (!groupRanges[groupTitle.title]) {
        groupRanges[groupTitle.title] = [adjustedIndex];
      } else {
        groupRanges[groupTitle.title].push(adjustedIndex);
      }
    }
  });

  Object.keys(groupRanges).forEach((groupTitle) => {
    const firstColumnIndex = groupRanges[groupTitle][0];
    const firstColumnLetter = worksheet.getColumn(firstColumnIndex).letter;
    groupRanges[groupTitle].forEach((columnIndex) => {
      const columnLetter = worksheet.getColumn(columnIndex).letter;
      const headerCell = worksheet.getCell(`${columnLetter}${headerRow}`);

      headerCell.value = {
        formula: `CONCAT(CONCAT($${firstColumnLetter}$${formulaRows.baseRow},"."),${columnLetter}${formulaRows.offsetRow})`,
      };
    });
  });
};

module.exports = {
  PROFILES_COLUMN_DEFINITIONS: { ...SIMPLE_COLUMN_DEFINITIONS, ...PLUGIN_COLUMN_DEFINITIONS },
  SIMPLE_COLUMN_DEFINITIONS,
  PLUGIN_COLUMN_DEFINITIONS,
  computeHeaderValues,
};
