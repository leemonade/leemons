const { LeemonsValidator } = require('leemons-validator');
const { LeemonsError } = require('leemons-error');
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
const { programsByIds } = require('../core/programs/programsByIds');
const { subjectNeedCourseForAdd } = require('../core/subjects/subjectNeedCourseForAdd');
const { getCourseIndex } = require('../core/courses/getCourseIndex');
const { getProgramSubjectDigits } = require('../core/programs/getProgramSubjectDigits');
const { programHaveMultiCourses } = require('../core/programs/programHaveMultiCourses');

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
    totalHours: numberSchema,
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
    totalHours: numberSchema,
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

function validateSubstagesFormat({ programData, substages, ctx }) {
  if (substages.length < programData.numberOfSubstages)
    throw new LeemonsError(ctx, {
      message: 'The number of substages is less than the number of substages specified',
    });
  _.forEach(substages, (substage) => {
    if (substage.abbreviation.length > programData.maxSubstageAbbreviation)
      throw new LeemonsError(ctx, {
        message: 'The substage abbreviation is longer than the specified length',
      });
    if (programData.maxSubstageAbbreviationIsOnlyNumbers && !/^[0-9]+$/.test(substage.abbreviation))
      throw new LeemonsError(ctx, {
        message:
          'The substage abbreviation must be only numbers and the length must be the same as the specified length',
      });
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

async function validateAddKnowledge({ data, ctx }) {
  const validator = new LeemonsValidator(addKnowledgeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const [program] = await programsByIds({ ids: data.program, ctx });

  if (!program) {
    throw new LeemonsError(ctx, { message: 'The program does not exist' });
  }

  // ES: Comprobamos si el programa puede tener areas de conocimiento
  if (!program.haveKnowledge) {
    throw new LeemonsError(ctx, { message: 'The program does not have knowledges' });
  }

  if (program.maxKnowledgeAbbreviation) {
    // ES: Comprobamos si el nombre del conocimiento es mayor que el maximo
    if (data.abbreviation.length > program.maxKnowledgeAbbreviation)
      throw new LeemonsError(ctx, {
        message: 'The knowledge abbreviation is longer than the specified length',
      });
  }

  // ES: Comprobamos si el nobre del conocimiento es solo numeros
  if (program.maxKnowledgeAbbreviationIsOnlyNumbers && !/^[0-9]+$/.test(data.abbreviation))
    throw new LeemonsError(ctx, { message: 'The knowledge abbreviation must be only numbers' });

  // ES: Comprobamos si el conocimiento ya existe
  const knowledge = await ctx.tx.db.Knowledges.countDocuments({
    abbreviation: data.abbreviation,
    program: program.id,
  });

  if (knowledge) throw new LeemonsError(ctx, { message: 'The knowledge already exists' });
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

async function validateUpdateKnowledge({ data, ctx }) {
  const validator = new LeemonsValidator(updateKnowledgeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const _knowledge = await ctx.tx.db.Knowledges.findOne({ id: data.id }).lean();
  if (!_knowledge) {
    throw new LeemonsError(ctx, { message: 'The knowledge does not exist' });
  }

  const [program] = await programsByIds({ ids: _knowledge.program, ctx });

  if (!program) {
    throw new LeemonsError(ctx, { message: 'The program does not exist' });
  }

  // ES: Comprobamos si el programa puede tener areas de conocimiento
  if (!program.haveKnowledge) {
    throw new LeemonsError(ctx, { message: 'The program does not have knowledges' });
  }

  if (program.maxKnowledgeAbbreviation) {
    // ES: Comprobamos si el nombre del conocimiento es mayor que el maximo
    if (data.abbreviation.length > program.maxKnowledgeAbbreviation)
      throw new LeemonsError(ctx, {
        message: 'The knowledge abbreviation is longer than the specified length',
      });
  }

  // ES: Comprobamos si el nobre del conocimiento es solo numeros
  if (program.maxKnowledgeAbbreviationIsOnlyNumbers && !/^[0-9]+$/.test(data.abbreviation))
    throw new LeemonsError(ctx, { message: 'The knowledge abbreviation must be only numbers' });

  // ES: Comprobamos si el conocimiento ya existe
  const knowledge = await ctx.tx.db.Knowledges.countDocuments({
    id: { $ne: data.id },
    abbreviation: data.abbreviation,
    program: program.id,
  });

  if (knowledge) throw new LeemonsError(ctx, { message: 'The knowledge already exists' });
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

async function validateAddSubjectType({ data, ctx }) {
  const validator = new LeemonsValidator(addSubjectTypeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const count = await ctx.tx.db.Programs.countDocuments({ id: data.program });
  if (!count) {
    throw new LeemonsError(ctx, { message: 'The program does not exist' });
  }

  // ES: Comprobamos que no exista ya el subject type
  const subjectTypeCount = await ctx.tx.db.SubjectTypes.countDocuments({
    program: data.program,
    name: data.name,
  });

  if (subjectTypeCount) throw new LeemonsError(ctx, { message: 'The subject type already exists' });
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
  required: ['id', 'name', 'groupVisibility'],
  additionalProperties: false,
};

async function validateUpdateSubjectType({ data, ctx }) {
  const validator = new LeemonsValidator(updateSubjectTypeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const subjectType = await ctx.tx.db.SubjectTypes.findOne({ id: data.id }).lean();

  if (!subjectType) {
    throw new LeemonsError(ctx, { message: 'The subject type does not exist' });
  }

  // ES: Comprobamos que no exista ya el subject type
  const subjectTypeCount = await ctx.tx.db.SubjectTypes.countDocuments({
    id: { $ne: data.id },
    program: subjectType.program,
    name: data.name,
  });

  if (subjectTypeCount) throw new LeemonsError(ctx, { message: 'The subject type already exists' });
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

async function validateAddCourse({ data, ctx }) {
  const validator = new LeemonsValidator(addCourseSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const program = await ctx.tx.db.Programs.findOne({ id: data.program }).lean();
  if (!program) {
    throw new LeemonsError(ctx, { message: 'The program does not exist' });
  }

  // ES: Comprobamos que no se sobrepase el numero maximo de cursos
  const courseCount = await ctx.tx.db.Groups.countDocuments({
    program: data.program,
    type: 'course',
  });
  if (courseCount >= program.maxNumberOfCourses) {
    throw new LeemonsError(ctx, {
      message: 'The program has reached the maximum number of courses',
    });
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

async function validateAddGroup({ data, ctx }) {
  const validator = new LeemonsValidator(addGroupSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const program = await ctx.tx.db.Programs.findOne({ id: data.program }).lean();
  if (!program) {
    throw new LeemonsError(ctx, { message: 'The program does not exist' });
  }

  if (program.useOneStudentGroup) {
    const group = await ctx.tx.db.Groups.countDocuments({ program: data.program, type: 'group' });
    if (group)
      throw new LeemonsError(ctx, {
        message: 'This program configured as one group, you can´t add a new group',
      });
  }

  if (!data.isAlone) {
    if (program.maxGroupAbbreviation) {
      // ES: Comprobamos si el nombre del grupo es mayor que el maximo
      if (data.abbreviation.length > program.maxGroupAbbreviation)
        throw new LeemonsError(ctx, {
          message: 'The group abbreviation is longer than the specified length',
        });
    }

    // ES: Comprobamos si el nombre del grupo es solo numeros
    if (program.maxGroupAbbreviationIsOnlyNumbers && !/^[0-9]+$/.test(data.abbreviation))
      throw new LeemonsError(ctx, { message: 'The group abbreviation must be only numbers' });
  }
  // ES: Comprobamos que no exista ya el grupo
  const groupCount = await ctx.tx.db.Groups.countDocuments({
    abbreviation: data.abbreviation,
    program: data.program,
    type: 'group',
  });

  if (groupCount) throw new LeemonsError(ctx, { message: 'The group already exists' });
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

async function validateDuplicateGroup({ data, ctx }) {
  const validator = new LeemonsValidator(duplicateGroupSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const group = await ctx.tx.db.Groups.findOne({ id: data.id }).lean();
  if (!group) {
    throw new LeemonsError(ctx, { message: 'The group does not exist' });
  }

  const program = await ctx.tx.db.Programs.findOne({ id: group.program }).lean();
  if (!program) {
    throw new LeemonsError(ctx, { message: 'The program does not exist' });
  }

  if (program.maxGroupAbbreviation) {
    // ES: Comprobamos si el nombre del grupo es mayor que el maximo
    if (data.abbreviation.length > program.maxGroupAbbreviation)
      throw new LeemonsError(ctx, {
        message: 'The group abbreviation is longer than the specified length',
      });
  }

  // ES: Comprobamos si el nombre del grupo es solo numeros
  if (program.maxGroupAbbreviationIsOnlyNumbers && !/^[0-9]+$/.test(data.abbreviation))
    throw new LeemonsError(ctx, { message: 'The group abbreviation must be only numbers' });

  // ES: Comprobamos que no exista ya el grupo
  const groupCount = await ctx.tx.db.Groups.countDocuments({
    abbreviation: data.abbreviation,
    program: program.id,
    type: 'group',
  });

  if (groupCount) throw new LeemonsError(ctx, { message: 'The group already exists' });
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

async function validateUpdateCourse({ data, ctx }) {
  const validator = new LeemonsValidator(updateCourseSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const course = await ctx.tx.db.Groups.findOne({ id: data.id }).lean();
  if (!course) {
    throw new LeemonsError(ctx, { message: 'The course does not exist' });
  }

  // ES: Comprobamos que no exista ya el curso
  // EN: Check if the course already exists
  const groupCount = await ctx.tx.db.Groups.countDocuments({
    id: { $ne: data.id },
    abbreviation: data.abbreviation,
    program: course.program,
    type: 'course',
  });

  if (groupCount) throw new LeemonsError(ctx, { message: 'The course already exists' });
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

async function validateUpdateGroup({ data, ctx }) {
  const validator = new LeemonsValidator(updateGroupSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const group = await ctx.tx.db.Groups.findOne({ id: data.id }).lean();
  if (!group) {
    throw new LeemonsError(ctx, { message: 'The group does not exist' });
  }

  // ES: Comprobamos que no exista ya el curso
  // EN: Check if the group already exists
  const groupCount = await ctx.tx.db.Groups.countDocuments({
    id: { $ne: data.id },
    abbreviation: data.abbreviation,
    program: group.program,
    type: 'group',
  });

  if (groupCount) throw new LeemonsError(ctx, { message: 'The group already exists' });
}

async function validateProgramNotUsingInternalId({ program, compiledInternalId, subject, ctx }) {
  const query = { program, compiledInternalId };
  if (subject) query.subject = { $ne: subject };
  const count = await ctx.tx.db.ProgramSubjectsCredits.countDocuments(query);
  if (count) {
    throw new LeemonsError(ctx, { message: 'The internalId is already in use' });
  }
}

async function validateInternalIdHaveGoodFormat({ program, internalId, ctx }) {
  const subjectDigits = await getProgramSubjectDigits({ program, ctx });
  // ES: Comprobamos si el numero de digitos no es el mismo
  if (internalId.length !== subjectDigits)
    throw new LeemonsError(ctx, {
      message: 'internalId does not have the required number of digits',
    });
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

async function validateAddSubject({ data, ctx }) {
  const { course: _course, ..._data } = data;
  const validator = new LeemonsValidator(addSubjectSchema);

  if (!validator.validate(_data)) {
    throw validator.error;
  }

  // ES: Comprobamos si el programa tiene o puede tener cursos asignados
  // EN: Check if the program has or can have courses assigned
  const [needCourse, haveMultiCourses] = await Promise.all([
    subjectNeedCourseForAdd({ program: data.program, ctx }),
    programHaveMultiCourses({ id: data.program, ctx }),
  ]);

  // ES: Si tiene/puede comprobamos si dentro de los datos nos llega a que curso va dirigida la nueva asignatura
  // EN: If it has/can we check if inside the data we get that the new subject is directed to which course
  if (!haveMultiCourses) {
    if (needCourse) {
      if (!data.course) throw new LeemonsError(ctx, { message: 'The course is required' });
      const course = await ctx.tx.db.Groups.findOne({ id: data.course, type: 'course' }).lean();
      if (!course) throw new LeemonsError(ctx, { message: 'The course does not exist' });
    }
    // ES: Si no tiene/puede comprobamos que no nos llega a que curso va dirigida la nueva asignatura
    // EN: If it not has/can we check if inside the data we get that the new subject is not directed to which course
    else if (data.course) {
      throw new LeemonsError(ctx, { message: 'The course is not required' });
    }
  }
  await validateInternalIdHaveGoodFormat({
    program: data.program,
    internalId: data.internalId,
    ctx,
  });

  await validateProgramNotUsingInternalId({
    program: data.program,
    compiledInternalId:
      (data.course ? await getCourseIndex({ course: data.course, ctx }) : '') + data.internalId,
    ctx,
  });
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

async function validateUpdateSubject({ data, ctx }) {
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

    const subject = await ctx.tx.db.Subjects.findOne({ id: data.id }).select(['program']).lean();

    await validateInternalIdHaveGoodFormat({
      program: subject.program,
      internalId: data.internalId,
      ctx,
    });

    await validateProgramNotUsingInternalId({
      program: subject.program,
      compiledInternalId:
        (data.course ? await getCourseIndex({ course: data.course, ctx }) : '') + data.internalId,
      subject: data.id,
      ctx,
    });
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

async function validateAddClass({ data, ctx }) {
  const validator = new LeemonsValidator(addClassSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const program = await ctx.tx.db.Programs.findOne({ id: data.program })
    .select(['id', 'moreThanOneAcademicYear', 'useOneStudentGroup'])
    .lean();

  if (!program.moreThanOneAcademicYear) {
    if (isArray(data.course) && data.course.length > 1) {
      throw new LeemonsError(ctx, { message: 'Class does not have multi courses' });
    }
  }

  if (data.teachers) {
    const teachersByType = _.groupBy(data.teachers, 'type');
    if (teachersByType['main-teacher'] && teachersByType['main-teacher'].length > 1) {
      throw new LeemonsError(ctx, { message: 'There can only be one main teacher' });
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

async function validateAddInstanceClass({ data, ctx }) {
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
    const needCourse = await subjectNeedCourseForAdd({ program: data.program, ctx });

    // ES: Si tiene/puede comprobamos si dentro de los datos nos llega a que curso va dirigida la nueva asignatura
    // EN: If it has/can we check if inside the data we get that the new subject is directed to which course
    if (needCourse) {
      if (!data.internalIdCourse)
        throw new LeemonsError(ctx, { message: 'The internalIdCourse is required' });
      const course = await ctx.tx.db.Groups.findOne({
        id: data.internalIdCourse,
        type: 'course',
      }).lean();
      if (!course) throw new LeemonsError(ctx, { message: 'The course does not exist' });
    }
    // ES: Si no tiene/puede comprobamos que no nos llega a que curso va dirigida la nueva asignatura
    // EN: If it not has/can we check if inside the data we get that the new subject is not directed to which course
    else if (data.internalIdCourse) {
      throw new LeemonsError(ctx, { message: 'The course is not required' });
    }

    await validateInternalIdHaveGoodFormat({
      program: data.program,
      internalId: data.internalId,
      ctx,
    });

    await validateProgramNotUsingInternalId({
      program: data.program,
      compiledInternalId:
        (data.internalIdCourse
          ? await getCourseIndex({ course: data.internalIdCourse, ctx })
          : '') + data.internalId,
      ctx,
    });
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

async function validateUpdateClass({ data, ctx }) {
  const validator = new LeemonsValidator(updateClassSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const classe = await ctx.tx.db.Class.findOne({ id: data.id }).select(['program']).lean();
  const haveMultiCourses = await programHaveMultiCourses({ id: classe.program, ctx });

  if (!haveMultiCourses) {
    if (isArray(data.course) && data.course.length > 1) {
      throw new LeemonsError(ctx, { message: 'Class does not have multi courses' });
    }
  }

  if (data.teachers) {
    const teachersByType = _.groupBy(data.teachers, 'type');
    if (teachersByType['main-teacher'] && teachersByType['main-teacher'].length > 1) {
      throw new LeemonsError(ctx, { message: 'There can only be one main teacher' });
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
