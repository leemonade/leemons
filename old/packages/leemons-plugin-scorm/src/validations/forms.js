const _ = require('lodash');

const { LeemonsValidator } = global.utils;
const {
  stringSchema,
  booleanSchema,
  stringSchemaNullable,
  textSchemaNullable,
} = require('./types');

const savePackageSchema = {
  type: 'object',
  properties: {
    id: stringSchemaNullable,
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
    file: {
      type: ['string'],
      nullable: false,
    },
    version: {
      type: ['string'],
      nullable: false,
    },
    launchUrl: {
      type: ['string'],
      nullable: false,
    },
    metadata: {
      type: ['object'],
      nullable: true,
    },
    gradable: booleanSchema,
    packageAsset: stringSchemaNullable,
    program: stringSchemaNullable,
    subjects: {
      type: 'array',
      items: stringSchema,
      nullable: true,
    },
    published: booleanSchema,
  },
  required: ['name', 'file', 'version', 'launchUrl'],
  additionalProperties: false,
};

function validateSavePackage(data) {
  const schema = _.cloneDeep(savePackageSchema);
  const validator = new LeemonsValidator(schema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateSavePackage,
  savePackageSchema,
};
