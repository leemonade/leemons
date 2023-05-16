const periodValidationObject = {
  type: 'object',
  properties: {
    center: {
      type: 'string',
      format: 'uuid',
    },
    program: {
      type: 'string',
      format: 'uuid',
    },
    course: {
      type: 'string',
      format: 'uuid',
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
  const validator = new global.utils.LeemonsValidator(periodValidationObject);

  if (!validator.validate(period)) {
    throw validator.error;
  }
}

module.exports = {
  periodValidationObject,
  validatePeriod,
};
