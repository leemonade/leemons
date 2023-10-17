const _ = require('lodash');
const { LeemonsValidator } = require('@leemons/validator');

const assignationObject = {
  type: 'object',
  properties: {
    instance: {
      type: 'string',
      nullable: false,
    },
    indexable: {
      type: 'boolean',
      nullable: false,
    },
    users: {
      type: 'array',
      items: {
        type: 'string',
        nullable: false,
      },
    },
    classes: {
      type: 'array',
      items: {
        type: 'string',
      },
      nullable: false,
    },
    group: {
      type: 'string',
      nullable: true,
    },
    grades: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          subject: {
            type: 'string',
            nullable: true,
          },
          type: {
            type: 'string',
            maxLength: 255,
            nullable: false,
          },
          grade: {
            type: 'number',
            nullable: true,
          },
          gradedBy: {
            type: 'string',
            nullable: false,
          },
          feedback: {
            type: 'string',
            maxLength: 16777215,
            nullable: true,
          },
        },
      },
    },
    timestamps: {
      type: 'object',
      patternProperties: {
        '^.*$': {
          oneOf: [
            {
              type: 'string',
              format: 'date-time',
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
    },
    status: {
      type: 'string',
      maxLength: 255,
    },
    metadata: {
      type: 'object',
    },
  },
};

const assignationRequiredProperties = ['instance', 'indexable'];

function validateAssignation(assignation, { useRequired } = {}) {
  const obj = _.clone(assignationObject);

  if (useRequired) {
    obj.required = assignationRequiredProperties;
  }

  const validator = new LeemonsValidator(obj);

  if (!validator.validate(assignation)) {
    throw validator.error;
  }
}

module.exports = {
  validateAssignation,
  assignationObject,
  assignationRequiredProperties,
};
