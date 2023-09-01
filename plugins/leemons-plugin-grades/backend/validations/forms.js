const _ = require('lodash');
const { stringSchema, numberSchema } = require('./types');
const { LeemonsValidator } = require('leemons-validator');
const { LeemonsError } = require('leemons-error');

const addGradeSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    center: stringSchema,
    minScaleToPromote: numberSchema,
    type: {
      type: 'string',
      enum: ['numeric', 'letter'],
    },
  },
  required: ['name', 'type', 'center', 'minScaleToPromote'],
  additionalProperties: false,
};
const addGradeNumericSchema = {
  type: 'object',
  properties: {
    isPercentage: {
      type: 'boolean',
    },
    scales: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          number: {
            type: 'number',
            minimum: 0,
          },
          description: stringSchema,
        },
        required: ['number'],
        additionalProperties: false,
      },
    },
  },
  required: ['isPercentage', 'scales'],
  additionalProperties: false,
};
const addGradeLetterSchema = {
  type: 'object',
  properties: {
    scales: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          letter: stringSchema,
          number: {
            type: 'number',
            minimum: 0,
          },
          description: stringSchema,
        },
        required: ['number', 'letter'],
        additionalProperties: false,
      },
    },
  },
  required: ['scales'],
  additionalProperties: false,
};

function validateAddGrade({ data, disableRequired }) {
  const schema = addGradeSchema;
  if (disableRequired) {
    schema.required = ['name', 'type', 'center'];
  }

  const validator = new LeemonsValidator(schema);
  const { name, type, center, minScaleToPromote, ...rest } = data;

  if (!validator.validate({ name, type, center, minScaleToPromote })) {
    throw validator.error;
  }

  if (type === 'numeric') {
    const validator2 = new LeemonsValidator(addGradeNumericSchema);
    if (!validator2.validate(rest)) {
      throw validator2.error;
    }
  } else {
    const validator2 = new LeemonsValidator(addGradeLetterSchema);
    if (!validator2.validate(rest)) {
      throw validator2.error;
    }
  }
}

const updateGradeSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    minScaleToPromote: stringSchema,
  },
  required: ['id'],
  additionalProperties: false,
};

async function validateUpdateGrade({ data, ctx }) {
  const validator = new LeemonsValidator(updateGradeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  // ES: Comprobar que el id existe
  // EN: Check if the id exists
  const grade = await ctx.tx.db.Grades.countDocuments({ id: data.id });
  if (!grade) throw new LeemonsError(ctx, { message: 'Grade not found' });

  if (data.minScaleToPromote) {
    // ES: Comprobamos que el scale existe
    // EN: Check if the scale exists
    const scale = ctx.tx.db.GradeScales.countDocuments({ id: data.minScaleToPromote });
    if (!scale) throw new LeemonsError(ctx, { message });
  }
}

const addGradeScaleSchema = {
  type: 'object',
  properties: {
    letter: stringSchema,
    number: {
      type: 'number',
      minimum: 0,
    },
    order: {
      type: 'number',
    },
    description: stringSchema,
    grade: stringSchema,
  },
  required: ['number', 'grade'],
  additionalProperties: false,
};

async function validateAddGradeScale({ data, ctx }) {
  const validator = new LeemonsValidator(addGradeScaleSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const grade = await ctx.tx.db.Grades.findOne({ id: data.grade })
    .select(['type', 'letter'])
    .lean();
  if (!grade) throw new LeemonsError(ctx, { message: 'Grade not found' });

  if (grade.type === 'numeric') {
    if (data.letter) {
      throw new LeemonsError(ctx, { message: 'Letter not allowed in grade type numeric' });
    }
  }
}

const updateGradeScaleSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    letter: stringSchema,
    number: {
      type: 'number',
      minimum: 0,
    },
    order: {
      type: 'number',
    },
    description: stringSchema,
  },
  required: ['id', 'number'],
  additionalProperties: false,
};

async function validateUpdateGradeScale({ data, ctx }) {
  const validator = new LeemonsValidator(updateGradeScaleSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const scale = await ctx.tx.db.GradeScales.findOne({ id: data.id }).select(['id', 'grade']).lean();
  if (!scale) throw new LeemonsError(ctx, { message: 'Scale not found' });

  const grade = await ctx.tx.db.Grades.findOne({ id: scale.grade })
    .select(['type', 'letter'])
    .lean();
  if (!grade) throw new LeemonsError(ctx, { message: 'Grade not found' });

  if (grade.type === 'numeric') {
    if (data.letter) {
      throw new LeemonsError(ctx, { message: 'Letter not allowed in grade type numeric' });
    }
  }
}

const addGradeTagSchema = {
  type: 'object',
  properties: {
    letter: stringSchema,
    scale: stringSchema,
    description: stringSchema,
    grade: stringSchema,
  },
  required: ['scale', 'grade', 'letter', 'description'],
  additionalProperties: false,
};

async function validateAddGradeTag({ data, ctx }) {
  const validator = new LeemonsValidator(addGradeTagSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  // ES: Comprobamos si existe el grado
  // EN: Check if the grade exists
  const grade = await ctx.tx.db.Grades.countDocuments({ id: data.grade });
  if (!grade) throw new LeemonsError(ctx, { message: 'Grade not found' });

  // ES: Comprobamos si existe la escala
  // EN: Check if the scale exists
  const scale = await ctx.tx.db.GradeScales.countDocuments({ id: data.scale });
  if (!scale) throw new LeemonsError(ctx, { message: 'Scale not found' });
}

const updateGradeTagSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    letter: stringSchema,
    scale: stringSchema,
    description: stringSchema,
  },
  required: ['id', 'scale', 'letter', 'description'],
  additionalProperties: false,
};

async function validateUpdateGradeTag({ data, ctx }) {
  const validator = new LeemonsValidator(updateGradeTagSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  // ES: Comprobamos si existe el tag de grado
  // EN: Check if the grade tag exists
  const gradeTag = await ctx.tx.db.GradeTags.countDocuments({ id: data.id });
  if (!gradeTag) throw new LeemonsError(ctx, { message: 'Grade tag not found' });

  // ES: Comprobamos si existe la escala
  // EN: Check if the scale exists
  const scale = await ctx.tx.db.GradeScales.countDocuments({ id: data.scale });
  if (!scale) throw new LeemonsError(ctx, { message: 'Scale not found' });
}

const conditionSchema = {
  type: 'object',
  properties: {
    source: {
      type: 'string',
      enum: ['program', 'course', 'subject-type', 'knowledge', 'subject', 'subject-group'],
    },
    sourceIds: {
      type: 'array',
      items: stringSchema,
    },
    data: {
      type: 'string',
      enum: ['gpa', 'cpp', 'cpc', 'grade', 'enrolled', 'credits', 'cbcg'],
    },
    dataTargets: {
      type: 'array',
      items: stringSchema,
    },
    operator: {
      type: 'string',
      enum: ['lte', 'gte', 'lt', 'gt', 'eq', 'neq'],
    },
    target: numberSchema,
    targetGradeScale: stringSchema,
    group: {
      type: 'object',
      additionalProperties: true,
    },
  },
  required: [],
  additionalProperties: false,
};

const groupSchema = {
  type: 'object',
  properties: {
    operator: {
      type: 'string',
      enum: ['and', 'or'],
    },
    conditions: {
      type: 'array',
      items: _.cloneDeep(conditionSchema),
    },
  },
  required: ['operator'],
  additionalProperties: false,
};

const addRuleSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    center: stringSchema,
    grade: stringSchema,
    program: stringSchema,
    group: _.cloneDeep(groupSchema),
  },
  required: ['name', 'center', 'grade', 'program', 'group'],
  additionalProperties: false,
};

function validateAddRule({ data, isDependency }) {
  const rules = _.cloneDeep(addRuleSchema);
  if (isDependency) {
    rules.properties.subject = stringSchema;
    rules.required.push('subject');
  }
  const validator = new LeemonsValidator(rules);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const updateRuleSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    center: stringSchema,
    grade: stringSchema,
    program: stringSchema,
    group: _.cloneDeep(groupSchema),
  },
  required: ['id', 'name', 'center', 'grade', 'program', 'group'],
  additionalProperties: false,
};

function validateUpdateRule({ data, isDependency }) {
  const rules = _.cloneDeep(updateRuleSchema);
  if (isDependency) {
    rules.properties.subject = stringSchema;
    rules.required.push('subject');
  }
  const validator = new LeemonsValidator(rules);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const addConditionGroupSchema = {
  type: 'object',
  properties: {
    operator: {
      type: 'string',
      enum: ['and', 'or'],
    },
    rule: stringSchema,
    conditions: {
      type: 'array',
      items: _.cloneDeep(conditionSchema),
    },
  },
  required: ['operator', 'rule', 'conditions'],
  additionalProperties: false,
};

function validateAddConditionGroup({ data }) {
  const validator = new LeemonsValidator(addConditionGroupSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

const addConditionRefToGroupSchema = {
  type: 'object',
  properties: {
    group: _.cloneDeep(groupSchema),
    rule: stringSchema,
    parentGroup: stringSchema,
  },
  required: ['group', 'rule', 'parentGroup'],
  additionalProperties: false,
};

const addConditionSchema = _.cloneDeep(conditionSchema);
addConditionSchema.properties.rule = stringSchema;
addConditionSchema.properties.parentGroup = stringSchema;
addConditionSchema.required = ['source', 'sourceIds', 'data', 'rule', 'parentGroup'];

function validateAddCondition({ group, ...rest }) {
  const schema = group ? addConditionRefToGroupSchema : addConditionSchema;
  const data = group ? { ...rest, group } : rest;

  const validator = new LeemonsValidator(schema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddRule,
  validateAddGrade,
  validateUpdateRule,
  validateUpdateGrade,
  validateAddGradeTag,
  validateAddCondition,
  validateAddGradeScale,
  validateUpdateGradeTag,
  validateUpdateGradeScale,
  validateAddConditionGroup,
};
