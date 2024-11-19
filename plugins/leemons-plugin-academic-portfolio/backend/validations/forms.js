const { LeemonsError } = require('@leemons/error');
const { LeemonsValidator } = require('@leemons/validator');
const _ = require('lodash');
const { isArray } = require('lodash');

const { PROGRAM_STAFF_ROLES } = require('../config/constants');
const { getCourseIndex } = require('../core/courses/getCourseIndex');
const { getProgramSubjectDigits } = require('../core/programs/getProgramSubjectDigits');
const { programHaveMultiCourses } = require('../core/programs/programHaveMultiCourses');
const { subjectNeedCourseForAdd } = require('../core/subjects/subjectNeedCourseForAdd');

const {
  stringSchema,
  booleanSchema,
  integerSchema,
  arrayStringSchema,
  integerSchemaNullable,
  stringSchemaNullable,
  numberSchema,
} = require('./types');

const MAIN_TEACHER_TYPE = 'main-teacher';
const ASSOCIATE_TEACHER_TYPE = 'associate-teacher';
const teacherTypes = [MAIN_TEACHER_TYPE, ASSOCIATE_TEACHER_TYPE];

const staffSchema = {
  type: 'object',
  properties: Object.values(PROGRAM_STAFF_ROLES).reduce(
    (acc, role) => ({
      ...acc,
      [role]: stringSchemaNullable,
    }),
    {}
  ),
  additionalProperties: false,
};

const addProgramSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    color: stringSchemaNullable,
    centers: arrayStringSchema,
    evaluationSystem: stringSchema,
    useOneStudentGroup: booleanSchema,
    hideStudentsToStudents: booleanSchema,
    seatsForAllCourses: integerSchemaNullable,
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
    // maxGroupAbbreviation: integerSchema,
    // maxGroupAbbreviationIsOnlyNumbers: booleanSchema,
    maxNumberOfCourses: integerSchema,
    moreThanOneAcademicYear: booleanSchema,
    // courseCredits: integerSchema,
    hideCoursesInTree: booleanSchema,
    hasSubstagesPerCourse: booleanSchema,
    // maxKnowledgeAbbreviation: integerSchemaNullable,
    // maxKnowledgeAbbreviationIsOnlyNumbers: booleanSchema,
    // subjectsFirstDigit: {
    //   type: 'string',
    //   enum: ['none', 'course'],
    // },
    // subjectsDigits: integerSchema,
    treeType: integerSchema,
    //* AcaPortfolio 2.0
    customSubstages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: stringSchema,
          abbreviation: stringSchema,
        },
      },
    },
    courses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: integerSchema,
          minCredits: integerSchemaNullable,
          maxCredits: integerSchemaNullable,
          seats: integerSchema,
        },
        nullable: true,
      },
    },
    hasSubjectTypes: booleanSchema,
    useCustomSubjectIds: booleanSchema,
    hoursPerCredit: integerSchemaNullable,
    groupsMetadata: {
      type: 'object',
      properties: {
        nameFormat: stringSchema,
        digits: integerSchemaNullable,
        prefix: stringSchemaNullable,
        customNameFormat: stringSchemaNullable,
      },
      additionalProperties: true,
    },
    staff: staffSchema,
  },
  required: [
    'name',
    'centers',
    'abbreviation',
    'credits',
    'evaluationSystem',
    // 'hasSubstagesPerCourse',
    // 'maxGroupAbbreviation',
    // 'maxGroupAbbreviationIsOnlyNumbers',
    // 'subjectsFirstDigit',
    // 'subjectsDigits',
  ],
  additionalProperties: true,
};

// *Funcionalidad legacy para setear substages individualmente por curso pudiendo usar nomenclatura por defecto o custom
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
        required: ['name', 'number'],
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
  // *Funcionalidad legacy para setear substages individualmente por curso pudiendo usar nomenclatura por defecto o custom
  if (data.hasSubstagesPerCourse) {
    validator = new LeemonsValidator(addProgramSubstage1Schema);

    if (!validator.validate(data)) {
      throw validator.error;
    }

    if (!data.useDefaultSubstagesName) {
      validator = new LeemonsValidator(addProgramSubstage2Schema);

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
    treeType: integerSchema,
    managers: arrayStringSchema,
    hideStudentsToStudents: booleanSchema,
    totalHours: integerSchemaNullable,
    hoursPerCredit: integerSchemaNullable,
    useAutoAssignment: booleanSchema,
    staff: staffSchema,
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

const updateProgramConfigurationSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    staff: staffSchema,
  },
  required: ['id'],
  additionalProperties: true,
};

function validateUpdateProgramConfiguration(data) {
  const validator = new LeemonsValidator(updateProgramConfigurationSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const addKnowledgeAreaSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    abbreviation: stringSchema,
    color: stringSchema,
    icon: stringSchema,
    center: stringSchema,
    credits_course: integerSchemaNullable,
    credits_program: integerSchemaNullable,
    program: stringSchema,
    subjects: arrayStringSchema,
    managers: arrayStringSchema,
  },
  required: ['name', 'abbreviation', 'center'],
  additionalProperties: false,
};

async function validateAddKnowledgeArea({ data, ctx }) {
  const validator = new LeemonsValidator(addKnowledgeAreaSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  // ES: Comprobamos que el centro existe
  // EN: Verify that the center exists
  const centerExists = await ctx.tx.call('users.centers.existsById', {
    id: data.center,
  });
  if (!centerExists) {
    throw new LeemonsError(ctx, { message: 'Unable to find the specified center.' });
  }

  // ES: Comprobamos si el área de conocimiento ya existe
  const existentKnowledgeAreas = await ctx.tx.db.KnowledgeAreas.countDocuments({
    abbreviation: data.abbreviation,
    center: data.center,
  });

  if (existentKnowledgeAreas)
    throw new LeemonsError(ctx, {
      message: 'A knowledge area with the same abbreviation already exists at this center.',
    });
}

const updateKnowledgeAreaSchema = {
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
    center: stringSchema,
  },
  required: ['id', 'name', 'abbreviation', 'center'],
  additionalProperties: false,
};

async function validateUpdateKnowledgeArea({ data, ctx }) {
  const validator = new LeemonsValidator(updateKnowledgeAreaSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const _knowledgeArea = await ctx.tx.db.KnowledgeAreas.findOne({ id: data.id }).lean();
  if (!_knowledgeArea) {
    throw new LeemonsError(ctx, { message: 'The knowledge area does not exist' });
  }

  // ES: Comprobamos si el conocimiento ya existe en ese centro
  const existentKnowledgeAreas = await ctx.tx.db.KnowledgeAreas.countDocuments({
    id: { $ne: data.id },
    abbreviation: data.abbreviation,
    center: data.center,
  });

  if (existentKnowledgeAreas)
    throw new LeemonsError(ctx, {
      message: 'A knowledge area with the same abbreviation already exists at this center.',
    });
}

const addSubjectTypeSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    description: stringSchemaNullable,
    center: stringSchema,
    credits_course: integerSchemaNullable,
    credits_program: integerSchemaNullable,
    subjects: arrayStringSchema,
    managers: arrayStringSchema,
    program: stringSchema, // Outdated?
    groupVisibility: booleanSchema, // Outdated?
  },
  required: ['name', 'center'],
  additionalProperties: false,
};

async function validateAddSubjectType({ data, ctx }) {
  const validator = new LeemonsValidator(addSubjectTypeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  // ES: Comprobamos que el centro existe
  // EN: Verify that the center exists
  const centerExists = await ctx.tx.call('users.centers.existsById', {
    id: data.center,
  });
  if (!centerExists) {
    throw new LeemonsError(ctx, { message: 'Unable to find the specified center.' });
  }

  // ES: Comprobamos que no exista ya el subject type
  // EN: Verify that a subject type with the same name does not already exist in that center
  const existingEntriesCount = await ctx.tx.db.SubjectTypes.countDocuments({
    center: data.center,
    name: data.name,
  });

  if (existingEntriesCount > 0)
    throw new LeemonsError(ctx, {
      message: 'The specified name for the Subject Type is already in use at this center.',
    });
}

const updateSubjectTypeSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    description: stringSchemaNullable,
    groupVisibility: booleanSchema,
    credits_course: integerSchemaNullable,
    credits_program: integerSchemaNullable,
    managers: arrayStringSchema,
    center: stringSchema,
  },
  required: ['id', 'name', 'center'],
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

  // ES: Comprobamos que no exista ya el subject type en el centro
  const subjectTypeCount = await ctx.tx.db.SubjectTypes.countDocuments({
    id: { $ne: data.id },
    center: subjectType.center,
    name: data.name,
  });

  if (subjectTypeCount)
    throw new LeemonsError(ctx, {
      message: 'The specified name for the Subject Type is already in use at this center.',
    });
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
  additionalProperties: true,
};

async function validateAddCourse({ data, ctx }) {
  const validator = new LeemonsValidator(addCourseSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const program = await ctx.tx.db.Programs.findOne({ id: data.program }).lean();
  if (!program) {
    throw new LeemonsError(ctx, { message: 'The program does not exist.' });
  }

  // ES: Comprobamos que no se sobrepase el numero maximo de cursos
  const courseCount = await ctx.tx.db.Groups.countDocuments({
    program: data.program,
    type: 'course',
  });
  if (courseCount >= program.maxNumberOfCourses) {
    throw new LeemonsError(ctx, {
      message: 'The program has reached the maximum number of courses allowed.',
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
    metadata: {
      type: 'object',
      properties: {
        course: integerSchemaNullable,
      },
    },
    index: integerSchemaNullable,
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
        message: 'This program configured as one group, you cannot add a new group',
      });
  }

  // POSSIBLY OUDTATED as groups abreviation is treated differently now.
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

  if (groupCount) throw new LeemonsError(ctx, { message: 'This group alreday exists.' });
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
  required: ['id'],
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
  // *OLD: Not needed anymore as courses do not have an abbreviation
  // const groupCount = await ctx.tx.db.Groups.countDocuments({
  //   id: { $ne: data.id },
  //   abbreviation: data.abbreviation,
  //   program: course.program,
  //   type: 'course',
  // });

  // if (groupCount) throw new LeemonsError(ctx, { message: 'The course already exists' });
}

const updateGroupSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    abbreviation: stringSchema,
    managers: arrayStringSchema,
  },
  required: ['id'],
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
  // *OLD: Not needed anymore as courses do not have an abbreviation
  // const groupCount = await ctx.tx.db.Groups.countDocuments({
  //   id: { $ne: data.id },
  //   abbreviation: data.abbreviation,
  //   program: group.program,
  //   type: 'group',
  // });

  // if (groupCount) throw new LeemonsError(ctx, { message: 'The group already exists' });
}

const addSubjectSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    program: stringSchema,
    credits: numberSchema,
    course: { type: 'string', nullable: true },
    internalId: stringSchema,
    image: {
      type: ['string', 'object'],
      nullable: true,
    },
    icon: {
      type: ['string', 'object'],
      nullable: true,
    },
    color: stringSchema,
  },
  required: ['name', 'program'],
  additionalProperties: false,
};

async function validateAddSubject({ data, ctx }) {
  const validator = new LeemonsValidator(addSubjectSchema);
  if (!validator.validate(data)) {
    throw validator.error;
  }

  if (data.internalId?.length) {
    const isInternalIdUsed = await ctx.tx.db.ProgramSubjectsCredits.findOne({
      program: data.program,
      internalId: data.internalId,
    }).lean();

    if (isInternalIdUsed) {
      throw new LeemonsError(ctx, {
        message: 'This Internal ID is already in use within this program.',
        customCode: 'INTERNAL_ID_IN_USE',
      });
    }
  }
}

const updateSubjectSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    credits: integerSchemaNullable,
    subjectType: stringSchema,
    knowledgeArea: stringSchemaNullable,
    color: stringSchemaNullable,
    course: { type: 'string' },
    internalId: stringSchemaNullable,
    image: {
      type: ['string', 'object'],
      nullable: true,
    },
    icon: {
      type: ['string', 'object'],
      nullable: true,
    },
    substage: stringSchemaNullable,
    useBlocks: booleanSchema,
  },
  required: ['id'],
  additionalProperties: false,
};
const updateSubjectInternalIdSchema = {
  type: 'object',
  properties: {
    internalId: stringSchema,
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

    if (!validator2.validate({ internalId })) {
      throw validator2.error;
    }

    if (data.internalId?.length) {
      const subjectProgram = await ctx.tx.db.Subjects.findOne({ id: data.id })
        .select(['program'])
        .lean();
      const isInternalIdUsed = await ctx.tx.db.ProgramSubjectsCredits.findOne({
        subject: { $ne: data.id },
        program: subjectProgram.program,
        internalId: data.internalId,
      }).lean();

      if (isInternalIdUsed) {
        throw new LeemonsError(ctx, {
          message: 'This Internal ID is already in use within this program.',
          customCode: 'INTERNAL_ID_IN_USE',
        });
      }
    }
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
    group: stringSchemaNullable,
    subject: stringSchema,
    subjectType: stringSchemaNullable,
    knowledgeArea: stringSchemaNullable,
    color: stringSchema,
    virtualUrl: stringSchemaNullable,
    address: stringSchemaNullable,
    classWithoutGroupId: {
      type: 'string',
      minLength: 3,
      maxLength: 3,
      nullable: true,
    },
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
      nullable: true,
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
    classroomId: stringSchemaNullable,
    alias: stringSchemaNullable,
  },
  required: ['program', 'subject', 'seats'],
  additionalProperties: false,
};

async function validateAddClass({ data, ctx }) {
  const validator = new LeemonsValidator(addClassSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const program = await ctx.tx.db.Programs.findOne({ id: data.program })
    .select(['id', 'sequentialCourses'])
    .lean();

  // * OLD field name
  // if (!program.moreThanOneAcademicYear) {
  //   if (isArray(data.course) && data.course.length > 1) {
  //     throw new LeemonsError(ctx, { message: 'Class does not have multi courses' });
  //   }
  // }

  if (program.sequentialCourses && isArray(data.course) && data.course.length > 1) {
    throw new LeemonsError(ctx, {
      message:
        'The class cannot be offered in multiple courses as courses are sequential for this program.',
    });
  }

  // Currently no use case for this
  // if (data.teachers) {
  //   const teachersByType = _.groupBy(data.teachers, 'type');
  //   if (teachersByType[MAIN_TEACHER_TYPE] && teachersByType[MAIN_TEACHER_TYPE].length > 1) {
  //     throw new LeemonsError(ctx, { message: 'There can only be one main teacher' });
  //   }
  // }
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
    classroomId: { type: 'string', nullable: true },
    alias: { type: 'string', nullable: true },
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

  if (!haveMultiCourses && isArray(data.course) && data.course.length > 1) {
    throw new LeemonsError(ctx, { message: 'Class does not have multi courses' });
  }

  if (data.teachers) {
    const teachersByType = _.groupBy(data.teachers, 'type');
    if (teachersByType[MAIN_TEACHER_TYPE] && teachersByType[MAIN_TEACHER_TYPE].length > 1) {
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
    index: integerSchema,
  },
  required: ['name', 'program', 'courses', 'index'],
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

// ····························································································
// BLOCKS

async function validateSaveBlockRequirements({
  ctx,
  isEditing,
  subjectId: _subjectId,
  abbreviation,
  id,
}) {
  let subjectId = _subjectId;

  if (!isEditing) {
    // Subject exists and is configured to use blocks
    const subject = await ctx.tx.db.Subjects.findOne({ id: subjectId }).lean();
    if (!subject) {
      throw new LeemonsError(ctx, { message: 'The specified subject does not exist' });
    }
    if (!subject.useBlocks) {
      throw new LeemonsError(ctx, {
        message: 'This subject is not configured to use blocks.',
      });
    }
  } else {
    const block = await ctx.tx.db.Blocks.findOne({ id }).lean();
    subjectId = block.subject;
  }

  // Uniqueness of block abbreviation
  let repeatedAbbreviation = false;
  const blocksWithSameAbreviation = await ctx.tx.db.Blocks.find({
    abbreviation,
    subject: subjectId,
  });

  if (!isEditing && blocksWithSameAbreviation?.length) repeatedAbbreviation = true;
  if (isEditing && blocksWithSameAbreviation?.length && blocksWithSameAbreviation[0].id !== id)
    repeatedAbbreviation = true;

  if (repeatedAbbreviation)
    throw new LeemonsError(ctx, { message: 'A block with this abbreviation already exists.' });
}

const addBlockSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    abbreviation: stringSchema,
    subject: stringSchema,
    index: integerSchema,
  },
  required: ['name', 'abbreviation', 'subject', 'index'],
  additionalProperties: false,
};

async function validateAddBlock({ data, ctx }) {
  const validator = new LeemonsValidator(addBlockSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  await validateSaveBlockRequirements({
    ctx,
    isEditing: false,
    subjectId: data.subject,
    abbreviation: data.abbreviation,
  });
}

const updateBlockSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    abbreviation: stringSchema,
    index: integerSchemaNullable,
  },
  required: ['id'],
  additionalProperties: false,
};

async function validateUpdateBlock({ data, ctx }) {
  const validator = new LeemonsValidator(updateBlockSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  await validateSaveBlockRequirements({
    ctx,
    isEditing: true,
    abbreviation: data.abbreviation,
    id: data.id,
  });
}

const validateStaffChangeSchema = {
  type: 'object',
  properties: {
    program: stringSchema,
    staff: staffSchema,
  },
  required: ['program', 'staff'],
  additionalProperties: false,
};

function validateValidateStaffChange(data) {
  const validator = new LeemonsValidator(validateStaffChangeSchema);

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
  validateUpdateProgramConfiguration,
  validateUpdateClass,
  validateUpdateGroup,
  validateUpdateCycle,
  validateUpdateCourse,
  validateAddKnowledgeArea,
  validateUpdateProgram,
  validateUpdateSubject,
  validateDuplicateGroup,
  validateAddSubjectType,
  validateUpdateKnowledgeArea,
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
  validateAddBlock,
  validateUpdateBlock,
  validateValidateStaffChange,
};
