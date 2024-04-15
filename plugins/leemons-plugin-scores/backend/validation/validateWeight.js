const { LeemonsError } = require('@leemons/error');
const { LeemonsValidator } = require('@leemons/validator');

const weightValidationObject = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['averages', 'roles', 'modules'],
    },
    class: {
      type: 'string',
    },

    weights: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: {
            type: 'string',
          },
          weight: {
            type: 'number',
            minimum: 0,
            maximum: 1,
          },
          isLocked: {
            type: 'boolean',
          },
        },
        required: ['id', 'weight'],
      },
    },

    applySameValue: {
      type: 'boolean',
    },

    explanation: {
      type: 'string',
    },
  },

  allOf: [
    {
      if: {
        properties: {
          type: { const: 'averages' },
        },
      },
      then: {
        properties: {
          weights: { not: {} },
          applySameValue: { not: {} },
          explanation: { not: {} },
        },
      },
      else: {
        required: ['weights'],
      },
    },
  ],
  additionalProperties: false,
  required: ['type', 'class'],
};

function validateWeight({ weight, ctx }) {
  const validator = new LeemonsValidator(weightValidationObject);

  if (!validator.validate(weight)) {
    throw new LeemonsError(ctx, {
      message: validator.error.message,
      httpStatusCode: 400,
      stack: validator.error.stack,
    });
  }
}

module.exports = {
  weightValidationObject,
  validateWeight,
};
