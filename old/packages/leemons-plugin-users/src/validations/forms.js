const { LeemonsValidator } = global.utils;
const { stringSchema } = require('./types');

const addUsersBulkSchema = {
  type: 'object',
  properties: {
    center: stringSchema,
    profile: stringSchema,
    users: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          email: stringSchema,
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        required: ['email'],
        additionalProperties: true,
      },
    },
  },
  required: ['center', 'profile', 'users'],
  additionalProperties: false,
};

function validateAddUsersBulkForm(data) {
  const validator = new LeemonsValidator(addUsersBulkSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateAddUsersBulkForm,
};
