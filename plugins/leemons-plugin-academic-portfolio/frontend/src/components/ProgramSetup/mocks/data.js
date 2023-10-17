export const FIRST_DIGIT_OPTIONS = [
  { label: 'Course Nº', value: 'course' },
  { label: 'None', value: 'none' },
];

export const FREQUENCY_OPTIONS = [
  { label: 'Anual', value: 'Anual' },
  { label: 'Half-yearly (Semester)', value: 'Half-yearly' },
  { label: 'Quarterly (Trimester/Quarter)', value: 'Quarterly' },
  { label: 'Four-month period', value: 'Four-month' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Daily', value: 'Daily' },
];

export const BASIC_DATA = {
  labels: {
    title: 'Basic Data',
    name: 'Program name',
    abbreviation: 'Program abbreviation/acronym:',
    creditSystem: 'No need for credit system',
    credits: 'Total credits',
    oneStudentGroup: 'This program has only one group of students',
    groupsIDAbbrev: 'Groups ID Abbreviation',
    maxGroupAbbreviation: 'Max abbreviation length for groups:',
    maxGroupAbbreviationIsOnlyNumbers: 'Only numbers',
    buttonNext: 'Next',
  },
  descriptions: {
    maxGroupAbbreviation:
      'If you need to create more than one group of students (classrooms) per subject, this configuration allow you to define the alphanumeric ID format.',
  },
  placeholders: {
    name: 'My awesome program',
    abbreviation: 'HIGSxxxx',
  },
  helps: {
    abbreviation: '(8 char. max)',
    maxGroupAbbreviation: '(i.e: G01, G02, G03…)',
  },
  errorMessages: {
    name: { required: 'Program name is required' },
    abbreviation: { required: 'Program abbreviation is required' },
    maxGroupAbbreviation: { required: 'Max group abbreviation is required' },
  },
};

export const COURSES_DATA = {
  labels: {
    title: 'Courses',
    oneCourseOnly: 'This program takes one course only',
    hideCoursesInTree: 'Hidden courses in the tree (not nested subjects behind courses)',
    moreThanOneAcademicYear: 'The same subject may be offered in more than one academic year',
    maxNumberOfCourses: 'Number of courses',
    courseCredits: 'Credits per course',
    courseSubstage: 'Course substages',
    haveSubstagesPerCourse: 'No substages per course',
    substagesFrequency: 'Frecuency',
    numberOfSubstages: 'Number of substages',
    subtagesNames: 'Name the substages',
    useDefaultSubstagesName: 'Use the default name and abbreviation',
    abbreviation: 'Abbreviation',
    maxSubstageAbbreviation: 'Max abbrevation length',
    maxSubstageAbbreviationIsOnlyNumbers: 'Only numbers',
    buttonNext: 'Next',
    buttonPrev: 'Previous',
    cycles: 'Cycles',
    haveCycles: 'There are cycles or groupings of courses',
    cycleName: 'Cycle name',
    cycleNameRequired: 'Cycle name required',
    cycleCourses: 'Courses included',
    cycleCoursesRequired: 'Field required',
    add: 'Add cycle',
    remove: 'Remove',
    edit: 'Edit',
    accept: 'Accept',
    cancel: 'Cancel',
  },
  placeholders: {
    substagesFrequency: 'Select frequency...',
  },
  errorMessages: {
    useDefaultSubstagesName: { required: 'Required field' },
    maxNumberOfCourses: { required: 'Required field' },
    courseCredits: { required: 'Required field' },
    substagesFrequency: { required: 'Required field' },
    numberOfSubstages: { required: 'Required field' },
    maxSubstageAbbreviation: { required: 'Required field' },
  },
  frequencyOptions: FREQUENCY_OPTIONS,
};

export const SUBJECTS_DATA = {
  labels: {
    title: 'Subjects',
    standardDuration: 'Standard duration of the subjects',
    allSubjectsSameDuration: 'All subjects have the same duraction as the evaluation substage',
    numberOfSemesters: 'Number of semesters',
    periodName: 'Period name',
    numOfPeriods: 'N. periods',
    substagesFrequency: 'Frecuency',
    knowledgeAreas: 'Knowledge areas',
    haveKnowledge: 'Program have Knowledge areas',
    maxKnowledgeAbbreviation: 'Max abbreviation length for areas:',
    maxKnowledgeAbbreviationIsOnlyNumbers: 'Only numbers',
    subjectsIDConfig: 'Subjects ID configuration',
    subjectsFirstDigit: 'First digit',
    subjectsDigits: 'Digits',
    buttonNext: 'Save Program',
    buttonPrev: 'Previous',
    buttonAdd: 'Add',
    buttonRemove: 'Remove',
  },
  helps: {
    maxKnowledgeAbbreviation: '(i.e: MKTG, MATH, HIST…)',
  },
  errorMessages: {
    periodName: { required: 'Required field' },
    numOfPeriods: { required: 'Required field' },
    substagesFrequency: { required: 'Required field' },
  },
  firstDigitOptions: FIRST_DIGIT_OPTIONS,
  frequencyOptions: FREQUENCY_OPTIONS,
};

export const INIT_VALUES = {
  name: 'My Cool Program',
  abbreviation: 'MCP001',
  courseCredits: 100,
  creditSystem: false,
  credits: 200,
  haveSubstagesPerCourse: true,
  hideCoursesInTree: true,
  maxGroupAbbreviation: 3,
  maxGroupAbbreviationIsOnlyNumbers: true,
  maxNumberOfCourses: 2,
  maxSubstageAbbreviation: 3,
  maxSubstageAbbreviationIsOnlyNumbers: false,
  moreThanOneAcademicYear: false,
  numberOfSubstages: 2,
  oneStudentGroup: false,
  substages: [
    { name: 'Sem 1', abbreviation: 'S01' },
    { name: 'Sem 2', abbreviation: 'S02' },
  ],
  substagesFrequency: 'Half-yearly',
  useCreditSystem: false,
  useDefaultSubstagesName: false,
  useOneStudentGroup: false,

  allSubjectsSameDuration: false,
  customSubstages: [
    { name: 'Quarter 1', amount: 1, frequency: 'Quarterly' },
    { name: 'Quarter 2', amount: 1, frequency: 'Quarterly' },
  ],
  haveKnowledge: true,
  maxKnowledgeAbbreviation: 4,
  maxKnowledgeAbbreviationIsOnlyNumbers: false,
  subjectsFirstDigit: 'course',
  subjectsDigits: 2,
};
