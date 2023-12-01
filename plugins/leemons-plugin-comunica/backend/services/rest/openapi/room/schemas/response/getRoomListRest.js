// automatic hash: a1354834b7712e2e6e1846a65e7cae51e1db34b49212da86cf765cdd14714dba
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    rooms: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'key',
          'name',
          'subName',
          'image',
          'icon',
          'bgColor',
          'type',
          'useEncrypt',
          'program',
          'center',
          'isDeleted',
          '__v',
          'muted',
          'isAdmin',
          'unreadMessages',
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
          key: {
            type: 'string',
            minLength: 1,
          },
          name: {
            type: 'string',
            minLength: 1,
          },
          nameReplaces: {
            type: 'object',
            properties: {},
            required: [],
          },
          subName: {
            type: 'string',
            minLength: 1,
          },
          image: {
            type: 'string',
            minLength: 1,
          },
          icon: {
            type: 'string',
            minLength: 1,
          },
          bgColor: {
            type: 'string',
            minLength: 1,
          },
          type: {
            type: 'string',
            minLength: 1,
          },
          useEncrypt: {
            type: 'boolean',
          },
          metadata: {
            type: 'object',
            properties: {},
            required: [],
          },
          program: {
            type: 'string',
            minLength: 1,
          },
          center: {
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
          lastMessage: {},
          muted: {
            type: 'boolean',
          },
          attached: {},
          isAdmin: {
            type: 'boolean',
          },
          adminMuted: {},
          unreadMessages: {
            type: 'number',
          },
          userAgents: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: ['isAdmin', 'deleted', 'isDeleted'],
              properties: {
                userAgent: {
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
                        name: {
                          type: 'string',
                          minLength: 1,
                        },
                        surnames: {
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
                        gender: {
                          type: 'string',
                          minLength: 1,
                        },
                        createdAt: {
                          type: 'object',
                          properties: {},
                          required: [],
                        },
                        avatar: {
                          type: 'string',
                          minLength: 1,
                        },
                      },
                      required: [
                        '_id',
                        'id',
                        'name',
                        'surnames',
                        'email',
                        'birthdate',
                        'gender',
                        'createdAt',
                        'avatar',
                      ],
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
                  },
                  required: [
                    '_id',
                    'id',
                    'user',
                    'role',
                    'disabled',
                    'profile',
                  ],
                },
                adminMuted: {},
                isAdmin: {
                  type: 'boolean',
                },
                deleted: {
                  type: 'boolean',
                },
                isDeleted: {
                  type: 'boolean',
                },
              },
            },
          },
        },
      },
    },
  },
  required: ['status', 'rooms'],
};

module.exports = { schema };
