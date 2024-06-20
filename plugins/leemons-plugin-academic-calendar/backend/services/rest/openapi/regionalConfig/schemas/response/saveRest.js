// automatic hash: 6e13e7c45cdf6af8a94316d11b41a8024f4c87cfdfc64972642ec50e34818e09
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    regionalConfig: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          minLength: 1,
        },
        deploymentID: {
          type: 'string',
          minLength: 1,
        },
        name: {
          type: 'string',
          minLength: 1,
        },
        center: {
          type: 'string',
          minLength: 1,
        },
        regionalEvents: {
          type: 'string',
          minLength: 1,
        },
        localEvents: {
          type: 'string',
          minLength: 1,
        },
        daysOffEvents: {
          type: 'string',
          minLength: 1,
        },
        _id: {
          type: 'object',
          properties: {
            valueOf: {},
          },
          required: ['valueOf'],
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
      },
      required: [
        'id',
        'deploymentID',
        'name',
        'center',
        'regionalEvents',
        'localEvents',
        'daysOffEvents',
        '_id',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
      ],
    },
  },
  required: ['status', 'regionalConfig'],
};

module.exports = { schema };
