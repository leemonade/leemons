const PROGRAM_A = {
  name: 'Elementary',
  abbreviation: 'ELEM',
  allSubjectsSameDuration: true,
  centers: [],
  courseCredits: 0,
  creditSystem: false,
  credits: null,
  customSubstages: [],
  haveKnowledge: true,
  haveSubstagesPerCourse: false,
  hideCoursesInTree: false,
  maxGroupAbbreviation: 2,
  maxGroupAbbreviationIsOnlyNumbers: false,
  maxKnowledgeAbbreviation: 4,
  maxKnowledgeAbbreviationIsOnlyNumbers: false,
  maxNumberOfCourses: 6,
  moreThanOneAcademicYear: false,
  oneStudentGroup: false,
  subjectsDigits: 2,
  subjectsFirstDigit: 'course',
  useOneStudentGroup: false,
};

const PROGRAM_B = {
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
  maxGroupAbbreviation: 2,
  maxGroupAbbreviationIsOnlyNumbers: false,
  maxKnowledgeAbbreviation: 4,
  maxKnowledgeAbbreviationIsOnlyNumbers: false,
  maxNumberOfCourses: 2,
  moreThanOneAcademicYear: false,
  oneStudentGroup: false,
  subjectsDigits: 2,
  subjectsFirstDigit: 'course',
  useOneStudentGroup: false,
};

const KNOWLEDGE_A = {
  name: 'Science',
  abbreviation: 'SCNC',
  color: '#1B72E8',
  icon: 'science',
  program: null,
  credits_course: 1,
  credits_program: null,
};

const KNOWLEDGE_B = {
  name: 'Maths',
  abbreviation: 'MATH',
  color: '#E81B4A',
  icon: 'maths',
  program: null,
  credits_course: 1,
  credits_program: null,
};

const SUBJECT_TYPE = {
  name: 'Core',
  program: null,
  groupVisibility: false,
  credits_course: 1,
  credits_program: null,
};

const SUBJECTS_A = ['Biology', 'Chemistry'];
const SUBJECTS_B = ['Geometry', 'Algebra'];
const GROUPS = ['A', 'B'];

function generateSubjects(names, courses, program) {
  const subjects = [];
  names.forEach((name) => {
    for (let i = 1; i <= courses.length; i++) {
      subjects.push({
        name: `${name} ${i}`,
        program,
        course: courses[i].id,
      });
    }
  });
  return subjects;
}

function generateClassrooms(subjects, subjectType, knowledge) {
  const classrooms = [];

  subjects.forEach((subject) => {
    classrooms.push({
      program: subject.program,
      course: subject.course,
      subject: subject.id,
      subjectType,
      knowledge,
    });
  });

  return classrooms;
}

function generateGroups(names, program) {
  const groups = [];

  names.forEach((name) => {
    groups.push({
      name: `Section ${name}`,
      abbreviation: `S${name}`,
      program,
    });
  });

  return groups;
}

async function initAcademicPortfolio(centers, profiles) {
  const { services } = leemons.getPlugin('academic-portfolio');

  try {
    // ·····················································
    // SETTINGS

    const { student, teacher } = profiles;

    await services.settings.setProfiles({ student, teacher });

    // ·····················································
    // PROGRAMS

    const { centerA, centerB } = centers;

    const programA = await services.programs.addProgram({ ...PROGRAM_A, centers: [centerA] });
    const programB = await services.programs.addProgram({ ...PROGRAM_B, centers: [centerB] });

    // ·····················································
    // KNOWLEDGE AREAS

    const knowledgeA = await Promise.all([
      services.knowledges.addKnowledge({ ...KNOWLEDGE_A, program: programA.id }),
      services.knowledges.addKnowledge({ ...KNOWLEDGE_A, program: programB.id }),
    ]);

    const knowledgeB = await Promise.all([
      services.knowledges.addKnowledge({ ...KNOWLEDGE_B, program: programA.id }),
      services.knowledges.addKnowledge({ ...KNOWLEDGE_B, program: programB.id }),
    ]);

    // ·····················································
    // SUBJECT TYPES

    const subjectTypeA = await services.subjectType.addSubjectType({
      ...SUBJECT_TYPE,
      program: programA.id,
    });

    const subjectTypeB = await services.subjectType.addSubjectType({
      ...SUBJECT_TYPE,
      program: programB.id,
    });

    // ·····················································
    // SUBJECTS

    const subjectsAA = await Promise.all(
      generateSubjects(SUBJECTS_A, programA.courses, programA.id).map((subject) =>
        services.subjects.addSubject(subject)
      )
    );

    const subjectsAB = await Promise.all(
      generateSubjects(SUBJECTS_A, programB.courses, programB.id).map((subject) =>
        services.subjects.addSubject(subject)
      )
    );

    const subjectsBA = await Promise.all(
      generateSubjects(SUBJECTS_B, programA.courses, programA.id).map((subject) =>
        services.subjects.addSubject(subject)
      )
    );

    const subjectsBB = await Promise.all(
      generateSubjects(SUBJECTS_B, programB.courses, programB.id).map((subject) =>
        services.subjects.addSubject(subject)
      )
    );

    // ·····················································
    // CLASSES

    await Promise.all([
      ...generateClassrooms(subjectsAA, subjectTypeA.id, knowledgeA[0].id).map((classroom) =>
        services.class.addClass(classroom)
      ),
      ...generateClassrooms(subjectsAB, subjectTypeA.id, knowledgeA[1].id).map((classroom) =>
        services.class.addClass(classroom)
      ),
      ...generateClassrooms(subjectsBA, subjectTypeB.id, knowledgeB[0].id).map((classroom) =>
        services.class.addClass(classroom)
      ),
      ...generateClassrooms(subjectsBB, subjectTypeB.id, knowledgeB[1].id).map((classroom) =>
        services.class.addClass(classroom)
      ),
    ]);

    // ·····················································
    // GROUPS

    await Promise.all([
      ...generateGroups(GROUPS, programA.id),
      ...generateGroups(GROUPS, programB.id),
    ]);

    return { programA, programB };
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initAcademicPortfolio;
