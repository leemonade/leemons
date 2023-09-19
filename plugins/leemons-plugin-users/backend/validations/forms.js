const { LeemonsValidator, validateSchema } = require('@leemons/validator');

const addUsersBulkSchema = {
  type: 'object',
  properties: {
    center: validateSchema.string,
    profile: validateSchema.string,
    users: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          email: validateSchema.string,
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
