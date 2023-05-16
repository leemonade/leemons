const { LeemonsValidator } = global.utils;
const {
  stringSchema,
  arrayStringSchema,
  integerSchemaNullable,
  stringSchemaNullable,
  dateSchemaNullable,
  textSchema,
  dateSchema,
  booleanSchema,
} = require('./types');

const saveMessageSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    internalName: stringSchema,
    message: textSchema,
    url: stringSchemaNullable,
    textUrl: stringSchemaNullable,
    status: {
      type: 'string',
      enum: ['published', 'programmed', 'completed', 'unpublished', 'archived'],
      nullable: true,
    },
    zone: {
      type: 'string',
      enum: ['modal', 'dashboard', 'class-dashboard'],
    },
    publicationType: {
      type: 'string',
      enum: ['immediately', 'programmed'],
    },
    startDate: dateSchemaNullable,
    endDate: dateSchemaNullable,
    asset: {
      type: ['string', 'object'],
      nullable: true,
    },
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
    unpublishConflicts: booleanSchema,
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
