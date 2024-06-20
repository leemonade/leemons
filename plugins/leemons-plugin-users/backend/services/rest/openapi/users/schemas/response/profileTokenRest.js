// automatic hash: ecbeb2672c9b82c15dbac8ef212e5cd432c1ed4de259dabb04d91622f6866f58
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    jwtToken: {
      type: 'object',
      properties: {
        userToken: {
          type: 'string',
          minLength: 1,
        },
        sessionConfig: {
          type: 'object',
          properties: {},
          required: [],
        },
        centers: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
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
              token: {},
              userAgentId: {},
            },
          },
        },
      },
      required: ['userToken', 'sessionConfig', 'centers', 'profiles'],
    },
  },
  required: ['status', 'jwtToken'],
};

module.exports = { schema };
