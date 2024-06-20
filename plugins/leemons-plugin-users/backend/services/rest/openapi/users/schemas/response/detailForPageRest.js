// automatic hash: 8c1c947c4b2f97ca5ae1c027e25383d7236a77f40004262468da95b0cc5636bf
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    data: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
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
            surnames: {
              type: 'string',
              minLength: 1,
            },
            secondSurname: {
              type: 'string',
              minLength: 1,
            },
            email: {
              type: 'string',
              minLength: 1,
            },
            birthdate: {
              type: 'object',
              properties: {},
              required: [],
            },
            locale: {
              type: 'string',
              minLength: 1,
            },
            active: {
              type: 'boolean',
            },
            status: {
              type: 'string',
              minLength: 1,
            },
            gender: {
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
            avatar: {
              type: 'string',
              minLength: 1,
            },
            avatarAsset: {
              type: 'object',
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
                cover: {
                  type: 'string',
                  minLength: 1,
                },
                fromUser: {
                  type: 'string',
                  minLength: 1,
                },
                fromUserAgent: {
                  type: 'string',
                  minLength: 1,
                },
                public: {
                  type: 'boolean',
                },
                category: {
                  type: 'string',
                  minLength: 1,
                },
                indexable: {
                  type: 'boolean',
                },
                isCover: {
                  type: 'boolean',
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
                permissions: {
                  type: 'object',
                  properties: {
                    viewer: {
                      type: 'array',
                      items: {
                        required: [],
                        properties: {},
                      },
                    },
                    editor: {
                      type: 'array',
                      items: {
                        required: [],
                        properties: {},
                      },
                    },
                  },
                  required: ['viewer', 'editor'],
                },
              },
              required: [
                '_id',
                'id',
                'deploymentID',
                'name',
                'cover',
                'fromUser',
                'fromUserAgent',
                'public',
                'category',
                'indexable',
                'isCover',
                'isDeleted',
                'createdAt',
                'updatedAt',
                '__v',
                'permissions',
              ],
            },
            preferences: {},
          },
          required: [
            '_id',
            'id',
            'deploymentID',
            'name',
            'surnames',
            'secondSurname',
            'email',
            'birthdate',
            'locale',
            'active',
            'status',
            'gender',
            'isDeleted',
            'createdAt',
            'updatedAt',
            'avatar',
            'avatarAsset',
          ],
        },
        userAgents: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: ['id', 'role', 'disabled'],
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
              role: {
                type: 'string',
                minLength: 1,
              },
              disabled: {
                type: 'boolean',
              },
              profile: {
                type: 'object',
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
                required: [
                  '_id',
                  'id',
                  'deploymentID',
                  'name',
                  'description',
                  'uri',
                  'indexable',
                  'sysName',
                  'isDeleted',
                  'createdAt',
                  'updatedAt',
                  '__v',
                  'role',
                ],
              },
              center: {
                type: 'object',
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
                  locale: {
                    type: 'string',
                    minLength: 1,
                  },
                  uri: {
                    type: 'string',
                    minLength: 1,
                  },
                  timezone: {
                    type: 'string',
                    minLength: 1,
                  },
                  firstDayOfWeek: {
                    type: 'number',
                  },
                  country: {
                    type: 'string',
                    minLength: 1,
                  },
                  city: {
                    type: 'string',
                    minLength: 1,
                  },
                  postalCode: {
                    type: 'string',
                    minLength: 1,
                  },
                  street: {
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
                required: [
                  '_id',
                  'id',
                  'deploymentID',
                  'name',
                  'locale',
                  'uri',
                  'timezone',
                  'firstDayOfWeek',
                  'country',
                  'city',
                  'postalCode',
                  'street',
                  'isDeleted',
                  'createdAt',
                  'updatedAt',
                  '__v',
                ],
              },
            },
          },
        },
        dataset: {
          type: 'object',
          properties: {
            jsonSchema: {},
            jsonUI: {},
            value: {},
          },
          required: [],
        },
      },
      required: ['user', 'userAgents', 'dataset'],
    },
  },
  required: ['status', 'data'],
};

module.exports = { schema };
