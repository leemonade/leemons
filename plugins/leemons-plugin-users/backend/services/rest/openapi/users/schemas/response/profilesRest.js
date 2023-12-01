// automatic hash: c427965057fdc3016ac02662a023fda303d4e8f79ffb00bbc8272f7038d790c9
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    profiles: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'name',
          'description',
          'uri',
          'indexable',
          'sysName',
          'isDeleted',
          '__v',
          'role',
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
          name: {
            type: 'string',
            minLength: 1,
          },
          description: {
            type: 'string',
            minLength: 1,
          },
          uri: {
            type: 'string',
            minLength: 1,
          },
          indexable: {
            type: 'boolean',
          },
          sysName: {
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
          role: {
            type: 'string',
            minLength: 1,
          },
        },
      },
    },
  },
  required: ['status', 'profiles'],
};

module.exports = { schema };
