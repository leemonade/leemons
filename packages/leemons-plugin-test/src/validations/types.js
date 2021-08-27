const textSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 65000,
};

const stringSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 255,
};

const arrayStringRequiredSchema = {
  type: 'array',
  items: {
    type: 'string',
  },
  minItems: 1,
};

module.exports = {
  textSchema,
  stringSchema,
  arrayStringRequiredSchema,
};
