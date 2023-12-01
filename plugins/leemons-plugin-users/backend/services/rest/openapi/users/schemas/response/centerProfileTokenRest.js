// automatic hash: 9281c1d19ab32704339891bc24a514e4ee29750936721de594b67f667c74e372
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
          properties: {
            program: {
              type: 'string',
              minLength: 1,
            },
          },
          required: ['program'],
        },
        centers: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'id',
              'deploymentID',
              'name',
              'description',
              'locale',
              'email',
              'uri',
              'isDeleted',
              '__v',
              'token',
              'userAgentId',
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
              locale: {
                type: 'string',
                minLength: 1,
              },
              email: {
                type: 'string',
                minLength: 1,
              },
              uri: {
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
              token: {
                type: 'string',
                minLength: 1,
              },
              userAgentId: {
                type: 'string',
                minLength: 1,
              },
            },
          },
        },
      },
      required: ['userToken', 'sessionConfig', 'centers'],
    },
  },
  required: ['status', 'jwtToken'],
};

module.exports = { schema };
