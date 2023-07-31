const { LeemonsValidator } = global.utils;
const _ = require('lodash');
const { isArray } = require('lodash');
const {
  stringSchema,
  booleanSchema,
  integerSchema,
  arrayStringSchema,
  integerSchemaNullable,
  stringSchemaNullable,
  numberSchema,
} = require('./types');
const { programsByIds } = require('../services/programs/programsByIds');
const { table } = require('../services/tables');
const { subjectNeedCourseForAdd } = require('../services/subjects/subjectNeedCourseForAdd');
const { getCourseIndex } = require('../services/courses/getCourseIndex');
const { getProgramSubjectDigits } = require('../services/programs/getProgramSubjectDigits');
const { programHaveMultiCourses } = require('../services/programs/programHaveMultiCourses');

const teacherTypes = ['main-teacher', 'associate-teacher'];

const addProgramSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    color: stringSchemaNullable,
    centers: arrayStringSchema,
    evaluationSystem: stringSchema,
    useOneStudentGroup: booleanSchema,
    hideStudentsToStudents: booleanSchema,
    cycles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: stringSchema,
          courses: {
            type: 'array',
            items: {
              type: 'number',
            },
          },
        },
      },
    },
    image: {
      type: ['string', 'object'],
      nullable: true,
    },
    imageUrl: stringSchemaNullable,
    abbreviation: {
      type: 'string',
      minLength: 1,
      maxLength: 8,
    },
    credits: integerSchemaNullable,
    totalHours: integerSchemaNullable,
    maxGroupAbbreviation: integerSchema,
    maxGroupAbbreviationIsOnlyNumbers: booleanSchema,
    maxNumberOfCourses: integerSchema,
    moreThanOneAcademicYear: booleanSchema,
    courseCredits: integerSchema,
    hideCoursesInTree: booleanSchema,
    haveSubstagesPerCourse: booleanSchema,
    haveKnowledge: booleanSchema,
    maxKnowledgeAbbreviation: integerSchemaNullable,
    maxKnowledgeAbbreviationIsOnlyNumbers: booleanSchema,
    subjectsFirstDigit: {
      type: 'string',
      enum: ['none', 'course'],
    },
    subjectsDigits: integerSchema,
    treeType: integerSchema,
  },
  required: [
    'name',
    'centers',
    'abbreviation',
    'credits',
    'maxGroupAbbreviation',
    'maxGroupAbbreviationIsOnlyNumbers',
    'haveSubstagesPerCourse',
    'haveKnowledge',
    'subjectsFirstDigit',
    'subjectsDigits',
    'evaluationSystem',
  ],
  additionalProperties: true,
};

const addProgramSubstage1Schema = {
  type: 'object',
  properties: {
    substagesFrequency: {
      type: 'string',
      enum: ['year', 'semester', 'quarter', 'trimester', 'month', 'week', 'day'],
    },
    numberOfSubstages: numberSchema,
    useDefaultSubstagesName: booleanSchema,
    customSubstages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: stringSchema,
          frequency: stringSchema,
          number: numberSchema,
        },
        required: ['name', 'number', 'frequency'],
      },
    },
  },
  required: ['substagesFrequency', 'numberOfSubstages', 'useDefaultSubstagesName'],
  additionalProperties: true,
};

const addProgramSubstage2Schema = {
  type: 'object',
  properties: {
    maxSubstageAbbreviation: numberSchema,
    maxSubstageAbbreviationIsOnlyNumbers: booleanSchema,
    substages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: stringSchema,
          abbreviation: stringSchema,
        },
        required: ['name', 'abbreviation'],
      },
    },
  },
  required: ['maxSubstageAbbreviation', 'maxSubstageAbbreviationIsOnlyNumbers', 'substages'],
  additionalProperties: true,
};

function validateAddProgram(data) {
  let validator = new LeemonsValidator(addProgramSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  // ES: Si hay mas de un curso puede tener substages
  if (data.haveSubstagesPerCourse) {
    validator = new LeemonsValidator(addProgramSubstage1Schema);

    if (!validator.validate(data)) {
      throw validator.error;
    }

    if (!data.useDefaultSubstagesName) {
      validator = new LeemonsValidator(addProgramSubstage2Schema);

      // console.log(data.substages);
      if (!validator.validate(data)) {
        throw validator.error;
      }
    }
  }
}

const updateProgramSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    image: {
      type: ['string', 'object'],
      nullable: true,
    },
    imageUrl: stringSchemaNullable,
    color: stringSchemaNullable,
    abbreviation: {
      type: 'string',
      minLength: 1,
      maxLength: 8,
    },
    credits: integerSchemaNullable,
    totalHours: integerSchemaNullable,
    treeType: integerSchema,
    managers: arrayStringSchema,
    hideStudentsToStudents: booleanSchema,
  },
  required: ['id'],
  additionalProperties: false,
};

function validateUpdateProgram(data) {
  const validator = new LeemonsValidator(updateProgramSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

function validateSubstagesFormat(programData, substages) {
  if (substages.length < programData.numberOfSubstages)
    throw new Error('The number of substages is less than the number of substages specified');
  _.forEach(substages, (substage) => {
    if (substage.abbreviation.length > programData.maxSubstageAbbreviation)
      throw new Error('The substage abbreviation is longer than the specified length');
    if (programData.maxSubstageAbbreviationIsOnlyNumbers && !/^[0-9]+$/.test(substage.abbreviation))
      throw new Error(
        'The substage abbreviation must be only numbers and the length must be the same as the specified length'
      );
  });
}

const addKnowledgeSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    abbreviation: stringSchema,
    color: stringSchema,
    icon: stringSchema,
    program: stringSchema,
    credits_course: integerSchemaNullable,
    credits_program: integerSchemaNullable,
    subjects: arrayStringSchema,
    managers: arrayStringSchema,
  },
  required: ['name', 'abbreviation', 'program', 'color', 'icon'],
  additionalProperties: false,
};

async function validateAddKnowledge(data, { userSession, transacting } = {}) {
  const validator = new LeemonsValidator(addKnowledgeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const [program] = await programsByIds(data.program, { userSession, transacting });

  if (!program) {
    throw new Error('The program does not exist');
  }

  // ES: Comprobamos si el programa puede tener areas de conocimiento
  if (!program.haveKnowledge) {
    throw new Error('The program does not have knowledges');
  }

  if (program.maxKnowledgeAbbreviation) {
    // ES: Comprobamos si el nombre del conocimiento es mayor que el maximo
    if (data.abbreviation.length > program.maxKnowledgeAbbreviation)
      throw new Error('The knowledge abbreviation is longer than the specified length');
  }

  // ES: Comprobamos si el nobre del conocimiento es solo numeros
  if (program.maxKnowledgeAbbreviationIsOnlyNumbers && !/^[0-9]+$/.test(data.abbreviation))
    throw new Error('The knowledge abbreviation must be only numbers');

  // ES: Comprobamos si el conocimiento ya existe
  const knowledge = await table.knowledges.count(
    {
      abbreviation: data.abbreviation,
      program: program.id,
    },
    { transacting }
  );

  if (knowledge) throw new Error('The knowledge already exists');
}

const updateKnowledgeSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    abbreviation: stringSchema,
    color: stringSchema,
    icon: stringSchema,
    credits_course: integerSchemaNullable,
    credits_program: integerSchemaNullable,
    managers: arrayStringSchema,
  },
  required: ['id', 'name', 'abbreviation', 'color', 'icon'],
  additionalProperties: false,
};

async function validateUpdateKnowledge(data, { userSession, transacting } = {}) {
  const validator = new LeemonsValidator(updateKnowledgeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const _knowledge = await table.knowledges.findOne({ id: data.id }, { transacting });
  if (!_knowledge) {
    throw new Error('The knowledge does not exist');
  }

  const [program] = await programsByIds(_knowledge.program, { userSession, transacting });

  if (!program) {
    throw new Error('The program does not exist');
  }

  // ES: Comprobamos si el programa puede tener areas de conocimiento
  if (!program.haveKnowledge) {
    throw new Error('The program does not have knowledges');
  }

  if (program.maxKnowledgeAbbreviation) {
    // ES: Comprobamos si el nombre del conocimiento es mayor que el maximo
    if (data.abbreviation.length > program.maxKnowledgeAbbreviation)
      throw new Error('The knowledge abbreviation is longer than the specified length');
  }

  // ES: Comprobamos si el nobre del conocimiento es solo numeros
  if (program.maxKnowledgeAbbreviationIsOnlyNumbers && !/^[0-9]+$/.test(data.abbreviation))
    throw new Error('The knowledge abbreviation must be only numbers');

  // ES: Comprobamos si el conocimiento ya existe
  const knowledge = await table.knowledges.count(
    {
      id_$ne: data.id,
      abbreviation: data.abbreviation,
      program: program.id,
    },
    { transacting }
  );

  if (knowledge) throw new Error('The knowledge already exists');
}

const addSubjectTypeSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    groupVisibility: booleanSchema,
    program: stringSchema,
    credits_course: integerSchemaNullable,
    credits_program: integerSchemaNullable,
    subjects: arrayStringSchema,
    managers: arrayStringSchema,
  },
  required: ['name', 'groupVisibility', 'program'],
  additionalProperties: false,
};

async function validateAddSubjectType(data, { transacting } = {}) {
  const validator = new LeemonsValidator(addSubjectTypeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const count = await table.programs.count({ id: data.program }, { transacting });
  if (!count) {
    throw new Error('The program does not exist');
  }

  // ES: Comprobamos que no exista ya el subject type
  const subjectTypeCount = await table.subjectTypes.count(
    {
      program: data.program,
      name: data.name,
    },
    { transacting }
  );

  if (subjectTypeCount) throw new Error('The subject type already exists');
}

const updateSubjectTypeSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    groupVisibility: booleanSchema,
    credits_course: integerSchemaNullable,
    credits_program: integerSchemaNullable,
    managers: arrayStringSchema,
  },
  required: ['id', 'groupVisibility'],
  additionalProperties: false,
};

async function validateUpdateSubjectType(data, { transacting } = {}) {
  const validator = new LeemonsValidator(updateSubjectTypeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const subjectType = await table.subjectTypes.findOne({ id: data.id }, { transacting });

  if (!subjectType) {
    throw new Error('The subject type does not exist');
  }

  // ES: Comprobamos que no exista ya el subject type
  if (data.name) {
    const subjectTypeCount = await table.subjectTypes.count(
      {
        id_$ne: data.id,
        program: subjectType.program,
        name: data.name,
      },
      { transacting }
    );

    if (subjectTypeCount) throw new Error('The subject type already exists');
  }
}

const addCourseSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    abbreviation: stringSchema,
    program: stringSchema,
    number: integerSchema,
    isAlone: booleanSchema,
  },
  required: ['program'],
  additionalProperties: false,
};

async function validateAddCourse(data, { transacting } = {}) {
  const validator = new LeemonsValidator(addCourseSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const program = await table.programs.findOne({ id: data.program }, { transacting });
  if (!program) {
    throw new Error('The program does not exist');
  }

  // ES: Comprobamos que no se sobrepase el numero maximo de cursos
  const courseCount = await table.groups.count(
    { program: data.program, type: 'course' },
    { transacting }
  );
  if (courseCount >= program.maxNumberOfCourses) {
    throw new Error('The program has reached the maximum number of courses');
  }
}

const addGroupSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    abbreviation: stringSchema,
    program: stringSchema,
    isAlone: booleanSchema,
    subjects: arrayStringSchema,
    managers: arrayStringSchema,
    aditionalData: {
      type: 'object',
      properties: {
        group: stringSchema,
        course: stringSchema,
        knowledge: stringSchema,
        subjectType: stringSchema,
      },
    },
  },
  required: ['name', 'abbreviation', 'program'],
  additionalProperties: false,
};

async function validateAddGroup(data, { transacting } = {}) {
  const validator = new LeemonsValidator(addGroupSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const program = await table.programs.findOne({ id: data.program }, { transacting });
  if (!program) {
    throw new Error('The program does not exist');
  }

  if (program.useOneStudentGroup) {
    const group = await table.groups.count(
      { program: data.program, type: 'group' },
      { transacting }
    );
    if (group) throw new Error('This program configured as one group, you can´t add a new group');
  }

  if (!data.isAlone) {
    if (program.maxGroupAbbreviation) {
      // ES: Comprobamos si el nombre del grupo es mayor que el maximo
      if (data.abbreviation.length > program.maxGroupAbbreviation)
        throw new Error('The group abbreviation is longer than the specified length');
    }

    // ES: Comprobamos si el nombre del grupo es solo numeros
    if (program.maxGroupAbbreviationIsOnlyNumbers && !/^[0-9]+$/.test(data.abbreviation))
      throw new Error('The group abbreviation must be only numbers');
  }
  // ES: Comprobamos que no exista ya el grupo
  const groupCount = await table.groups.count(
    {
      abbreviation: data.abbreviation,
      program: data.program,
      type: 'group',
    },
    { transacting }
  );

  if (groupCount) throw new Error('The group already exists');
}

const duplicateGroupSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    abbreviation: stringSchema,
    teachers: booleanSchema,
    students: {
      oneOf: [
        {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        { type: 'boolean' },
      ],
    },
  },
  required: ['id', 'name', 'abbreviation'],
  additionalProperties: false,
};

async function validateDuplicateGroup(data, { transacting } = {}) {
  const validator = new LeemonsValidator(duplicateGroupSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const group = await table.groups.findOne({ id: data.id }, { transacting });
  if (!group) {
    throw new Error('The group does not exist');
  }

  const program = await table.programs.findOne({ id: group.program }, { transacting });
  if (!program) {
    throw new Error('The program does not exist');
  }

  if (program.maxGroupAbbreviation) {
    // ES: Comprobamos si el nombre del grupo es mayor que el maximo
    if (data.abbreviation.length > program.maxGroupAbbreviation)
      throw new Error('The group abbreviation is longer than the specified length');
  }

  // ES: Comprobamos si el nombre del grupo es solo numeros
  if (program.maxGroupAbbreviationIsOnlyNumbers && !/^[0-9]+$/.test(data.abbreviation))
    throw new Error('The group abbreviation must be only numbers');

  // ES: Comprobamos que no exista ya el grupo
  const groupCount = await table.groups.count(
    {
      abbreviation: data.abbreviation,
      program: program.id,
      type: 'group',
    },
    { transacting }
  );

  if (groupCount) throw new Error('The group already exists');
}

const updateCourseSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    abbreviation: stringSchema,
    number: stringSchema,
    managers: arrayStringSchema,
  },
  required: ['id', 'name', 'abbreviation'],
  additionalProperties: false,
};

async function validateUpdateCourse(data, { transacting } = {}) {
  const validator = new LeemonsValidator(updateCourseSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const course = await table.groups.findOne({ id: data.id }, { transacting });
  if (!course) {
    throw new Error('The course does not exist');
  }

  // ES: Comprobamos que no exista ya el curso
  // EN: Check if the course already exists
  const groupCount = await table.groups.count(
    {
      id_$ne: data.id,
      abbreviation: data.abbreviation,
      program: course.program,
      type: 'course',
    },
    { transacting }
  );

  if (groupCount) throw new Error('The course already exists');
}

const updateGroupSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    abbreviation: stringSchema,
    managers: arrayStringSchema,
  },
  required: ['id', 'name', 'abbreviation'],
  additionalProperties: false,
};

async function validateUpdateGroup(data, { transacting } = {}) {
  const validator = new LeemonsValidator(updateGroupSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const group = await table.groups.findOne({ id: data.id }, { transacting });
  if (!group) {
    throw new Error('The group does not exist');
  }

  // ES: Comprobamos que no exista ya el curso
  // EN: Check if the group already exists
  const groupCount = await table.groups.count(
    {
      id_$ne: data.id,
      abbreviation: data.abbreviation,
      program: group.program,
      type: 'group',
    },
    { transacting }
  );

  if (groupCount) throw new Error('The group already exists');
}

async function validateProgramNotUsingInternalId(
  program,
  compiledInternalId,
  { subject, transacting } = {}
) {
  const query = { program, compiledInternalId };
  if (subject) query.subject_$ne = subject;
  const count = await table.programSubjectsCredits.count(query, { transacting });
  if (count) {
    throw new Error('The internalId is already in use');
  }
}

async function validateInternalIdHaveGoodFormat(program, internalId, { transacting }) {
  const subjectDigits = await getProgramSubjectDigits(program, { transacting });
  // ES: Comprobamos si el numero de digitos no es el mismo
  if (internalId.length !== subjectDigits)
    throw new Error('internalId does not have the required number of digits');
  // ES: Comprobamos si son numeros
  // if (!/^[0-9]+$/.test(internalId)) throw new Error('The internalId must be a number');
}

const addSubjectSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    program: stringSchema,
    credits: numberSchema,
    internalId: stringSchema,
    image: {
      type: ['string', 'object'],
      nullable: true,
    },
    icon: {
      type: ['string', 'object'],
      nullable: true,
    },
  },
  required: ['name', 'program', 'internalId'],
  additionalProperties: false,
};

async function validateAddSubject(data, { transacting } = {}) {
  const { course: _course, ..._data } = data;
  const validator = new LeemonsValidator(addSubjectSchema);

  if (!validator.validate(_data)) {
    throw validator.error;
  }

  // ES: Comprobamos si el programa tiene o puede tener cursos asignados
  // EN: Check if the program has or can have courses assigned
  const [needCourse, haveMultiCourses] = await Promise.all([
    subjectNeedCourseForAdd(data.program, { transacting }),
    programHaveMultiCourses(data.program, { transacting }),
  ]);

  // ES: Si tiene/puede comprobamos si dentro de los datos nos llega a que curso va dirigida la nueva asignatura
  // EN: If it has/can we check if inside the data we get that the new subject is directed to which course
  if (!haveMultiCourses) {
    if (needCourse) {
      if (!data.course) throw new Error('The course is required');
      const course = await table.groups.findOne(
        { id: data.course, type: 'course' },
        { transacting }
      );
      if (!course) throw new Error('The course does not exist');
    }
    // ES: Si no tiene/puede comprobamos que no nos llega a que curso va dirigida la nueva asignatura
    // EN: If it not has/can we check if inside the data we get that the new subject is not directed to which course
    else if (data.course) {
      throw new Error('The course is not required');
    }
  }
  await validateInternalIdHaveGoodFormat(data.program, data.internalId, { transacting });

  await validateProgramNotUsingInternalId(
    data.program,
    (data.course ? await getCourseIndex(data.course, { transacting }) : '') + data.internalId,
    { transacting }
  );
}

const updateSubjectSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    credits: numberSchema,
    subjectType: stringSchema,
    knowledge: stringSchemaNullable,
    color: stringSchemaNullable,
    image: {
      type: ['string', 'object'],
      nullable: true,
    },
    icon: {
      type: ['string', 'object'],
      nullable: true,
    },
  },
  required: ['id'],
  additionalProperties: false,
};
const updateSubjectInternalIdSchema = {
  type: 'object',
  properties: {
    internalId: stringSchema,
    course: stringSchemaNullable,
  },
  required: ['internalId'],
  additionalProperties: false,
};

async function validateUpdateSubject(data, { transacting } = {}) {
  const { course, internalId, ..._data } = data;
  const validator = new LeemonsValidator(updateSubjectSchema);

  if (!validator.validate(_data)) {
    throw validator.error;
  }

  if (internalId) {
    const validator2 = new LeemonsValidator(updateSubjectInternalIdSchema);

    if (!validator2.validate({ course, internalId })) {
      throw validator2.error;
    }

    const subject = await table.subjects.findOne(
      { id: data.id },
      { columns: ['program'], transacting }
    );

    await validateInternalIdHaveGoodFormat(subject.program, data.internalId, { transacting });

    await validateProgramNotUsingInternalId(
      subject.program,
      (data.course ? await getCourseIndex(data.course, { transacting }) : '') + data.internalId,
      { subject: data.id, transacting }
    );
  }
}

const putSubjectCreditsSchema = {
  type: 'object',
  properties: {
    subject: stringSchema,
    program: stringSchema,
    credits: numberSchema,
  },
  required: ['subject', 'program', 'credits'],
  additionalProperties: false,
};

function validatePutSubjectCredits(data) {
  const validator = new LeemonsValidator(putSubjectCreditsSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const getSubjectCreditsSchema = {
  type: 'object',
  properties: {
    subject: stringSchema,
    program: stringSchema,
  },
  required: ['subject', 'program'],
  additionalProperties: false,
};
const getSubjectsCreditsSchema = {
  type: 'array',
  items: [
    {
      properties: {
        subject: stringSchema,
        program: stringSchema,
      },
      required: ['subject', 'program'],
      additionalProperties: false,
    },
  ],
};

function validateGetSubjectCredits(data) {
  const validator = new LeemonsValidator(getSubjectCreditsSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

function validateGetSubjectsCredits(data) {
  const validator = new LeemonsValidator(getSubjectsCreditsSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const getSubjectCreditsProgramSchema = {
  type: 'object',
  properties: {
    program: stringSchema,
  },
  required: ['program'],
  additionalProperties: false,
};

function validateGetSubjectCreditsProgram(data) {
  const validator = new LeemonsValidator(getSubjectCreditsProgramSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const addClassSchema = {
  type: 'object',
  properties: {
    program: stringSchema,
    course: {
      oneOf: [stringSchema, arrayStringSchema, { type: 'null' }],
    },
    group: stringSchema,
    subject: stringSchema,
    subjectType: stringSchema,
    knowledge: stringSchemaNullable,
    color: stringSchema,
    virtualUrl: stringSchemaNullable,
    address: stringSchemaNullable,
    icon: {
      type: ['string', 'object'],
      nullable: true,
    },
    substage: {
      oneOf: [stringSchema, arrayStringSchema, { type: 'null' }],
    },
    seats: numberSchema,
    classroom: stringSchema,
    teachers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          teacher: stringSchema,
          type: {
            type: 'string',
            enum: teacherTypes,
          },
        },
      },
    },
    image: {
      type: ['string', 'object'],
      nullable: true,
    },
    description: stringSchema,
    schedule: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true,
      },
    },
  },
  required: ['program', 'subject'],
  additionalProperties: false,
};

async function validateAddClass(data, { transacting }) {
  const validator = new LeemonsValidator(addClassSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const program = await table.programs.findOne(
    { id: data.program },
    { columns: ['id', 'moreThanOneAcademicYear', 'useOneStudentGroup'], transacting }
  );

  if (!program.moreThanOneAcademicYear) {
    if (isArray(data.course) && data.course.length > 1) {
      throw new Error('Class does not have multi courses');
    }
  }

  if (data.teachers) {
    const teachersByType = _.groupBy(data.teachers, 'type');
    if (teachersByType['main-teacher'] && teachersByType['main-teacher'].length > 1) {
      throw new Error('There can only be one main teacher');
    }
  }
}

const addInstanceClassSchema = {
  type: 'object',
  properties: {
    program: stringSchema,
    class: stringSchema,
    subjectType: stringSchema,
    course: stringSchema,
    group: stringSchema,
    credits: numberSchema,
  },
  required: ['program', 'class', 'subjectType'],
  additionalProperties: false,
};

const addInstanceClass2Schema = {
  type: 'object',
  properties: {
    internalId: stringSchema,
    internalIdCourse: stringSchema,
  },
  required: ['internalId'],
  additionalProperties: false,
};

async function validateAddInstanceClass(data, { transacting } = {}) {
  const { internalId, internalIdCourse, ..._data } = data;

  const validator = new LeemonsValidator(addInstanceClassSchema);

  if (!validator.validate(_data)) {
    throw validator.error;
  }

  if (internalId || internalIdCourse) {
    const validator2 = new LeemonsValidator(addInstanceClass2Schema);

    if (!validator2.validate({ internalId, internalIdCourse })) {
      throw validator.error;
    }

    // ES: Comprobamos si el programa tiene o puede tener cursos asignados
    // EN: Check if the program has or can have courses assigned
    const needCourse = await subjectNeedCourseForAdd(data.program, { transacting });

    // ES: Si tiene/puede comprobamos si dentro de los datos nos llega a que curso va dirigida la nueva asignatura
    // EN: If it has/can we check if inside the data we get that the new subject is directed to which course
    if (needCourse) {
      if (!data.internalIdCourse) throw new Error('The internalIdCourse is required');
      const course = await table.groups.findOne(
        { id: data.internalIdCourse, type: 'course' },
        { transacting }
      );
      if (!course) throw new Error('The course does not exist');
    }
    // ES: Si no tiene/puede comprobamos que no nos llega a que curso va dirigida la nueva asignatura
    // EN: If it not has/can we check if inside the data we get that the new subject is not directed to which course
    else if (data.internalIdCourse) {
      throw new Error('The course is not required');
    }

    await validateInternalIdHaveGoodFormat(data.program, data.internalId, { transacting });

    await validateProgramNotUsingInternalId(
      data.program,
      (data.internalIdCourse ? await getCourseIndex(data.internalIdCourse, { transacting }) : '') +
      data.internalId,
      { transacting }
    );
  }
}

const addClassStudentsSchema = {
  type: 'object',
  properties: {
    class: stringSchema,
    students: arrayStringSchema,
  },
  required: ['class', 'students'],
  additionalProperties: false,
};

function validateAddClassStudents(data) {
  const validator = new LeemonsValidator(addClassStudentsSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const addClassStudentsManySchema = {
  type: 'object',
  properties: {
    class: arrayStringSchema,
    students: arrayStringSchema,
  },
  required: ['class', 'students'],
  additionalProperties: false,
};

function validateAddClassStudentsMany(data) {
  const validator = new LeemonsValidator(addClassStudentsManySchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const addClassTeachersSchema = {
  type: 'object',
  properties: {
    class: stringSchema,
    teachers: {
      type: 'array',
      nullable: true,
      items: {
        type: 'object',
        properties: {
          teacher: stringSchema,
          type: {
            type: 'string',
            enum: teacherTypes,
          },
        },
      },
    },
  },
  required: ['class', 'teachers'],
  additionalProperties: false,
};

function validateAddClassTeachers(data) {
  const validator = new LeemonsValidator(addClassTeachersSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const addClassTeachersManySchema = {
  type: 'object',
  properties: {
    class: arrayStringSchema,
    teachers: {
      type: 'array',
      nullable: true,
      items: {
        type: 'object',
        properties: {
          teacher: stringSchema,
          type: {
            type: 'string',
            enum: teacherTypes,
          },
        },
      },
    },
  },
  required: ['class', 'teachers'],
  additionalProperties: false,
};

function validateAddClassTeachersMany(data) {
  const validator = new LeemonsValidator(addClassTeachersManySchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const updateClassSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    course: {
      oneOf: [stringSchema, arrayStringSchema, { type: 'null' }],
    },
    program: stringSchema,
    group: stringSchemaNullable,
    subject: stringSchemaNullable,
    subjectType: stringSchemaNullable,
    knowledge: stringSchemaNullable,
    color: stringSchemaNullable,
    icon: {
      type: ['string', 'object'],
      nullable: true,
    },
    substage: {
      oneOf: [stringSchema, arrayStringSchema, { type: 'null' }],
    },
    seats: integerSchemaNullable,
    classroom: stringSchemaNullable,
    address: stringSchemaNullable,
    virtualUrl: stringSchemaNullable,
    teachers: {
      type: 'array',
      nullable: true,
      items: {
        type: 'object',
        properties: {
          teacher: stringSchema,
          type: {
            type: 'string',
            enum: teacherTypes,
          },
        },
      },
    },
    image: {
      type: ['string', 'object'],
      nullable: true,
    },
    description: stringSchemaNullable,
    schedule: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true,
      },
    },
  },
  required: ['id'],
  additionalProperties: false,
};

async function validateUpdateClass(data, { transacting }) {
  const validator = new LeemonsValidator(updateClassSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const classe = await table.class.findOne({ id: data.id }, { columns: 'program', transacting });
  const haveMultiCourses = await programHaveMultiCourses(classe.program, { transacting });

  if (!haveMultiCourses) {
    if (isArray(data.course) && data.course.length > 1) {
      throw new Error('Class does not have multi courses');
    }
  }

  if (data.teachers) {
    const teachersByType = _.groupBy(data.teachers, 'type');
    if (teachersByType['main-teacher'] && teachersByType['main-teacher'].length > 1) {
      throw new Error('There can only be one main teacher');
    }
  }
}

const updateClassManySchema = {
  type: 'object',
  properties: {
    ids: arrayStringSchema,
    course: stringSchemaNullable,
    group: stringSchemaNullable,
    subjectType: stringSchemaNullable,
    knowledge: stringSchemaNullable,
  },
  required: ['ids'],
  additionalProperties: false,
};

function validateUpdateClassMany(data) {
  const validator = new LeemonsValidator(updateClassManySchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const addCycleSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    program: stringSchema,
    courses: arrayStringSchema,
  },
  required: ['name', 'program', 'courses'],
  additionalProperties: false,
};

function validateAddCycle(data) {
  const validator = new LeemonsValidator(addCycleSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const updateCycleSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    managers: arrayStringSchema,
  },
  required: ['name'],
  additionalProperties: false,
};

function validateUpdateCycle(data) {
  const validator = new LeemonsValidator(updateCycleSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddCycle,
  validateAddClass,
  validateAddGroup,
  validateAddCourse,
  validateAddSubject,
  validateAddProgram,
  validateUpdateClass,
  validateUpdateGroup,
  validateUpdateCycle,
  validateUpdateCourse,
  validateAddKnowledge,
  validateUpdateProgram,
  validateUpdateSubject,
  validateDuplicateGroup,
  validateAddSubjectType,
  validateUpdateKnowledge,
  validateUpdateClassMany,
  validateSubstagesFormat,
  validateAddClassStudents,
  validateAddClassTeachers,
  validateAddInstanceClass,
  validateUpdateSubjectType,
  validatePutSubjectCredits,
  validateGetSubjectCredits,
  validateGetSubjectsCredits,
  validateAddClassStudentsMany,
  validateAddClassTeachersMany,
  validateGetSubjectCreditsProgram,
  validateProgramNotUsingInternalId,
};
