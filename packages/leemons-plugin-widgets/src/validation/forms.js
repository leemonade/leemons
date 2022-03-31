const { LeemonsValidator } = global.utils;
const _ = require('lodash');

const updateItemOrdersSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      order: {
        type: 'number',
      },
    },
    required: ['id', 'order'],
    additionalProperties: false,
  },
};

function validateUpdateItemOrders(data) {
  const validator = new LeemonsValidator(updateItemOrdersSchema);

  if (!validator.validate(data)) {
    throw validator.error;
  }
}

module.exports = {
  validateUpdateItemOrders,
};
