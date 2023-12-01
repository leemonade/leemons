// automatic hash: 467d1e356f3eea8604589bbea31fa1becea9b4cd22ce2b63d998e562d3782fba
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    permissions: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'permissionName',
          'role',
          'isDeleted',
          '__v',
        ],
        properties: {
          id: {
            type: 'string',
            minLength: 1,
          },
          deploymentID: {
            type: 'string',
            minLength: 1,
          },
          permissionName: {
            type: 'string',
            minLength: 1,
          },
          role: {
            type: 'string',
            minLength: 1,
          },
          center: {},
          isDeleted: {
            type: 'boolean',
          },
          deletedAt: {},
          __v: {
            type: 'number',
          },
          actionNames: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
        },
      },
    },
  },
  required: ['status', 'permissions'],
};

module.exports = { schema };
