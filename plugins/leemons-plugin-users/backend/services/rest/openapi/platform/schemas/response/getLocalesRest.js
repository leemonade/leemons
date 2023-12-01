// automatic hash: 76fde815ce4d3d2b7bc5866dcec6dc4cd9b3d52f6b62fd5ddb49119729a9618a
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    locales: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: ['id', 'deploymentID', 'code', 'name', 'isDeleted', '__v'],
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
          code: {
            type: 'string',
            minLength: 1,
          },
          name: {
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
        },
      },
    },
  },
  required: ['status', 'locales'],
};

module.exports = { schema };
