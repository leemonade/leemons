const { LeemonsValidator } = require('@leemons/validator');

const periodValidationObject = {
  type: 'object',
  properties: {
    center: {
      type: 'string',
    },
    program: {
      type: 'string',
    },
    course: {
      type: 'string',
      nullable: true,
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    startDate: {
      oneOf: [
        {
          type: 'string',
          format: 'date-time',
          nullable: true,
        },
        {
          instanceof: 'Date',
        },
        {
          type: 'number',
        },
      ],
    },
    endDate: {
      oneOf: [
        {
          type: 'string',
          format: 'date-time',
          nullable: true,
        },
        {
          instanceof: 'Date',
        },
        {
          type: 'number',
        },
      ],
    },
  },
  required: ['center', 'program', 'name', 'startDate', 'endDate'],
};

function validatePeriod(period) {
  const validator = new LeemonsValidator(periodValidationObject);

  if (!validator.validate(period)) {
    throw validator.error;
  }
}

module.exports = {
  periodValidationObject,
  validatePeriod,
};
