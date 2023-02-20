const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const {
  stringSchema,
  booleanSchema,
  stringSchemaNullable,
  textSchemaNullable,
  textSchema,
} = require('./types');

const saveDocumentSchema = {
  type: 'object',
  properties: {
    id: stringSchema,
    name: stringSchema,
    tagline: stringSchemaNullable,
    description: textSchemaNullable,
    color: stringSchemaNullable,
    tags: {
      type: 'array',
      items: stringSchema,
    },
    cover: {
      type: ['object', 'string'],
      nullable: true,
    },
    featuredImage: {
      type: ['object', 'string'],
      nullable: true,
    },
    introductoryText: { type: 'string', nullable: true },
    content: {
      type: 'string',
      nullable: true,
    },
    program: stringSchemaNullable,
    subjects: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          subject: {
            type: 'string',
            format: 'uuid',
          },
          level: {
            type: 'string',
            maxLength: 255,
            nullable: true,
          },
        },
      },
      nullable: true,
    },
    published: booleanSchema,
  },
  required: ['name'],
  additionalProperties: false,
};

function validateSaveDocument(data) {
  const schema = _.cloneDeep(saveDocumentSchema);
  const validator = new LeemonsValidator(schema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateSaveDocument,
};
