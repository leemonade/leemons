// automatic hash: 3668f0b04e4d54df921bc42c0b849a27dc2e95e17ea267522490a260ce376b74
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    columns: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'order',
          'isDone',
          'isArchived',
          'bgColor',
          'isDeleted',
          '__v',
          'nameKey',
        ],
        properties: {
          _id: {
            type: 'object',
            properties: {
              valueOf: {},
            },
            required: ['valueOf'],
          },
          id: {
            type: 'string',
            minLength: 1,
          },
          deploymentID: {
            type: 'string',
            minLength: 1,
          },
          order: {
            type: 'number',
          },
          isDone: {
            type: 'boolean',
          },
          isArchived: {
            type: 'boolean',
          },
          bgColor: {
            type: 'string',
            minLength: 1,
          },
          isDeleted: {
            type: 'boolean',
          },
          deletedAt: {},
          createdAt: {
            type: 'object',
            properties: {},
            required: [],
          },
          updatedAt: {
            type: 'object',
            properties: {},
            required: [],
          },
          __v: {
            type: 'number',
          },
          nameKey: {
            type: 'string',
            minLength: 1,
          },
        },
      },
    },
  },
  required: ['status', 'columns'],
};

module.exports = { schema };
