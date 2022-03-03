const PRIMARY = {
  name: 'Primary',
  abbreviation: 'PRI',
  allSubjectsSameDuration: true,
  centers: [],
  courseCredits: 0,
  creditSystem: false,
  credits: null,
  customSubstages: [],
  haveKnowledge: true,
  haveSubstagesPerCourse: false,
  hideCoursesInTree: false,
  maxGroupAbbreviation: 3,
  maxGroupAbbreviationIsOnlyNumbers: false,
  maxKnowledgeAbbreviation: 4,
  maxKnowledgeAbbreviationIsOnlyNumbers: false,
  maxNumberOfCourses: 6,
  moreThanOneAcademicYear: false,
  oneStudentGroup: false,
  subjectsDigits: 2,
  subjectsFirstDigit: 'none',
  useOneStudentGroup: false,
};

const HIGH_SCHOOL = {
  name: 'High School',
  abbreviation: 'HIGH',
  allSubjectsSameDuration: true,
  centers: [],
  courseCredits: 0,
  creditSystem: false,
  credits: null,
  customSubstages: [],
  haveKnowledge: true,
  haveSubstagesPerCourse: false,
  hideCoursesInTree: false,
  maxGroupAbbreviation: 3,
  maxGroupAbbreviationIsOnlyNumbers: false,
  maxKnowledgeAbbreviation: 4,
  maxKnowledgeAbbreviationIsOnlyNumbers: false,
  maxNumberOfCourses: 6,
  moreThanOneAcademicYear: false,
  oneStudentGroup: false,
  subjectsDigits: 2,
  subjectsFirstDigit: 'none',
  useOneStudentGroup: false,
};

async function initAcademicPortfolio(centers) {
  const { centerA, centerB } = centers;
  let result = null;

  try {
    const programA = await leemons
      .getPlugin('academic-portfolio')
      .services.programs.addProgram({ ...PRIMARY, centers: [centerA] });

    const programB = await leemons
      .getPlugin('academic-portfolio')
      .services.programs.addProgram({ ...HIGH_SCHOOL, centers: [centerB] });

    result = { programA, programB };
  } catch (err) {
    console.error(err);
  }

  return result;
}

module.exports = initAcademicPortfolio;
