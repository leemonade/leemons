const _ = require('lodash');
const { table } = require('../services/tables');

const { LeemonsValidator } = global.utils;
const { stringSchema } = require('./types');

const addGradeSchema = {
  type: 'object',
  properties: {
    name: stringSchema,
    center: stringSchema,
    type: {
      type: 'string',
      enum: ['numeric', 'letter'],
    },
  },
  required: ['name', 'type', 'center'],
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
function validateAddGrade(data) {
  const validator = new LeemonsValidator(addGradeSchema);
  const { name, type, center, ...rest } = data;

  if (!validator.validate({ name, type, center })) {
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
function validateUpdateGrade(data, { transacting } = {}) {
  const validator = new LeemonsValidator(updateGradeSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  // ES: Comprobar que el id existe
  // EN: Check if the id exists
  const grade = table.grades.count({ id: data.id }, { transacting });
  if (!grade) throw new Error('Grade not found');

  if (data.minScaleToPromote) {
    // ES: Comprobamos que el scale existe
    // EN: Check if the scale exists
    const scale = table.gradeScales.count({ id: data.minScaleToPromote }, { transacting });
    if (!scale) throw new Error('Scale not found');
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
    description: stringSchema,
    grade: stringSchema,
  },
  required: ['number', 'grade'],
  additionalProperties: false,
};
async function validateAddGradeScale(data, { transacting } = {}) {
  const validator = new LeemonsValidator(addGradeScaleSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const grade = await table.grades.findOne({ id: data.grade }, { transacting });
  if (!grade) throw new Error('Grade not found');

  if (grade.type === 'numeric') {
    if (data.letter) {
      throw new Error('Letter not allowed in grade type numeric');
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
    description: stringSchema,
  },
  required: ['id', 'number'],
  additionalProperties: false,
};
async function validateUpdateGradeScale(data, { transacting } = {}) {
  const validator = new LeemonsValidator(updateGradeScaleSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  const scale = await table.gradeScales.findOne(
    { id: data.id },
    { columns: ['grade'], transacting }
  );
  if (!scale) throw new Error('Scale not found');

  const grade = await table.grades.findOne({ id: scale.grade }, { transacting });
  if (!grade) throw new Error('Grade not found');

  if (grade.type === 'numeric') {
    if (data.letter) {
      throw new Error('Letter not allowed in grade type numeric');
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
async function validateAddGradeTag(data, { transacting } = {}) {
  const validator = new LeemonsValidator(addGradeTagSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  // ES: Comprobamos si existe el grado
  // EN: Check if the grade exists
  const grade = await table.grades.count({ id: data.grade }, { transacting });
  if (!grade) throw new Error('Grade not found');

  // ES: Comprobamos si existe la escala
  // EN: Check if the scale exists
  const scale = await table.gradeScales.count({ id: data.scale }, { transacting });
  if (!scale) throw new Error('Scale not found');
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
async function validateUpdateGradeTag(data, { transacting } = {}) {
  const validator = new LeemonsValidator(updateGradeTagSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }

  // ES: Comprobamos si existe el tag de grado
  // EN: Check if the grade tag exists
  const gradeTag = await table.gradeTags.count({ id: data.id }, { transacting });
  if (!gradeTag) throw new Error('Grade tag not found');

  // ES: Comprobamos si existe la escala
  // EN: Check if the scale exists
  const scale = await table.gradeScales.count({ id: data.scale }, { transacting });
  if (!scale) throw new Error('Scale not found');
}

module.exports = {
  validateAddGrade,
  validateUpdateGrade,
  validateAddGradeTag,
  validateAddGradeScale,
  validateUpdateGradeTag,
  validateUpdateGradeScale,
};
