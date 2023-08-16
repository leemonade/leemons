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

const numberSchema = {
  type: 'number',
};

const arrayStringRequiredSchema = {
  type: 'array',
  items: {
    type: 'string',
  },
  minItems: 1,
};

const stringSchemaNullable = {
  type: 'string',
  minLength: 1,
  maxLength: 255,
  nullable: true,
};

module.exports = {
  textSchema,
  stringSchema,
  numberSchema,
  stringSchemaNullable,
  arrayStringRequiredSchema,
};
