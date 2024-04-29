// automatic hash: fffb9f53e52fcacdcade041023df421f80da4fa106a077ff6caafce4e9dca6da
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    assets: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'name',
          'cover',
          'fromUser',
          'fromUserAgent',
          'category',
          'indexable',
          'isCover',
          'isDeleted',
          '__v',
          'isPrivate',
          'duplicable',
          'assignable',
          'downloadable',
          'pinned',
          'editable',
          'deleteable',
          'shareable',
          'role',
          'prepared',
          'public',
          'pinneable',
          'fileExtension',
          'fileType',
          'url',
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
          program: {},
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
          isPrivate: {
            type: 'boolean',
          },
          classesCanAccess: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          canAccess: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: [
                'id',
                'name',
                'surnames',
                'email',
                'gender',
                'avatar',
                'editable',
                'fullName',
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
                userAgentIds: {
                  type: 'array',
                  items: {
                    required: [],
                    properties: {},
                  },
                },
                permissions: {
                  type: 'array',
                  items: {
                    required: [],
                    properties: {},
                  },
                },
                editable: {
                  type: 'boolean',
                },
                fullName: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
          },
          subjects: {},
          file: {
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
              provider: {
                type: 'string',
                minLength: 1,
              },
              type: {
                type: 'string',
                minLength: 1,
              },
              extension: {
                type: 'string',
                minLength: 1,
              },
              name: {
                type: 'string',
                minLength: 1,
              },
              size: {
                type: 'number',
              },
              uri: {
                type: 'string',
                minLength: 1,
              },
              isFolder: {
                type: 'boolean',
              },
              metadata: {
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
              'provider',
              'type',
              'extension',
              'name',
              'size',
              'uri',
              'isFolder',
              'metadata',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
            ],
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
          duplicable: {
            type: 'boolean',
          },
          assignable: {
            type: 'boolean',
          },
          downloadable: {
            type: 'boolean',
          },
          providerData: {},
          tags: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          pinned: {
            type: 'boolean',
          },
          editable: {
            type: 'boolean',
          },
          deleteable: {
            type: 'boolean',
          },
          shareable: {
            type: 'boolean',
          },
          role: {
            type: 'string',
            minLength: 1,
          },
          original: {
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
                  provider: {
                    type: 'string',
                    minLength: 1,
                  },
                  type: {
                    type: 'string',
                    minLength: 1,
                  },
                  extension: {
                    type: 'string',
                    minLength: 1,
                  },
                  name: {
                    type: 'string',
                    minLength: 1,
                  },
                  size: {
                    type: 'number',
                  },
                  uri: {
                    type: 'string',
                    minLength: 1,
                  },
                  isFolder: {
                    type: 'boolean',
                  },
                  metadata: {
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
                  'provider',
                  'type',
                  'extension',
                  'name',
                  'size',
                  'uri',
                  'isFolder',
                  'metadata',
                  'isDeleted',
                  'createdAt',
                  'updatedAt',
                  '__v',
                ],
              },
              fromUser: {
                type: 'string',
                minLength: 1,
              },
              fromUserAgent: {
                type: 'string',
                minLength: 1,
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
              program: {},
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
              isPrivate: {
                type: 'boolean',
              },
              classesCanAccess: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
              canAccess: {
                type: 'array',
                uniqueItems: true,
                minItems: 1,
                items: {
                  required: [
                    'id',
                    'name',
                    'surnames',
                    'email',
                    'gender',
                    'avatar',
                    'editable',
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
                    userAgentIds: {
                      type: 'array',
                      items: {
                        required: [],
                        properties: {},
                      },
                    },
                    permissions: {
                      type: 'array',
                      items: {
                        required: [],
                        properties: {},
                      },
                    },
                    editable: {
                      type: 'boolean',
                    },
                  },
                },
              },
              subjects: {},
              file: {
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
                  provider: {
                    type: 'string',
                    minLength: 1,
                  },
                  type: {
                    type: 'string',
                    minLength: 1,
                  },
                  extension: {
                    type: 'string',
                    minLength: 1,
                  },
                  name: {
                    type: 'string',
                    minLength: 1,
                  },
                  size: {
                    type: 'number',
                  },
                  uri: {
                    type: 'string',
                    minLength: 1,
                  },
                  isFolder: {
                    type: 'boolean',
                  },
                  metadata: {
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
                  'provider',
                  'type',
                  'extension',
                  'name',
                  'size',
                  'uri',
                  'isFolder',
                  'metadata',
                  'isDeleted',
                  'createdAt',
                  'updatedAt',
                  '__v',
                ],
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
              duplicable: {
                type: 'boolean',
              },
              assignable: {
                type: 'boolean',
              },
              downloadable: {
                type: 'boolean',
              },
              providerData: {},
              tags: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
              pinned: {
                type: 'boolean',
              },
              editable: {
                type: 'boolean',
              },
              deleteable: {
                type: 'boolean',
              },
              shareable: {
                type: 'boolean',
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
              'cover',
              'fromUser',
              'fromUserAgent',
              'category',
              'indexable',
              'isCover',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
              'isPrivate',
              'classesCanAccess',
              'canAccess',
              'file',
              'permissions',
              'duplicable',
              'assignable',
              'downloadable',
              'tags',
              'pinned',
              'editable',
              'deleteable',
              'shareable',
              'role',
            ],
          },
          prepared: {
            type: 'boolean',
          },
          public: {
            type: 'boolean',
          },
          pinneable: {
            type: 'boolean',
          },
          fileExtension: {
            type: 'string',
            minLength: 1,
          },
          fileType: {
            type: 'string',
            minLength: 1,
          },
          url: {
            type: 'string',
            minLength: 1,
          },
          metadata: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: ['value', 'label'],
              properties: {
                value: {
                  type: 'string',
                  minLength: 1,
                },
                label: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
          },
        },
      },
    },
  },
  required: ['status', 'assets'],
};

module.exports = { schema };
