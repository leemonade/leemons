const { LeemonsValidator } = global.utils;
const {
  stringSchema,
  arrayStringSchema,
  integerSchemaNullable,
  textSchema,
  dateSchema,
} = require('./types');

const saveMessageSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    internalName: stringSchema,
    message: textSchema,
    url: stringSchema,
    textUrl: stringSchema,
    zone: {
      type: 'string',
      enum: ['modal', 'dashboard', 'class-dashboard'],
    },
    publicationType: {
      type: 'string',
      enum: ['immediately', 'programmed'],
    },
    startDate: dateSchema,
    endDate: dateSchema,
    centers: {
      type: 'array',
      items: stringSchema,
    },
    programs: {
      type: 'array',
      items: stringSchema,
    },
    profiles: {
      type: 'array',
      items: stringSchema,
    },
    classes: {
      type: 'array',
      items: stringSchema,
    },
  },
  required: ['internalName', 'message', 'zone', 'publicationType', 'centers'],
  additionalProperties: false,
};

async function validateSaveMessage(data) {
  const validator = new LeemonsValidator(saveMessageSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateSaveMessage,
};
