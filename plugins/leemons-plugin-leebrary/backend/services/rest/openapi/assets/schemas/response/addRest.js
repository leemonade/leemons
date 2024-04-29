// automatic hash: 24c90ebc9741371b12c30d6c776c1bd7a8fe693b9c4e459d773270fe92fec62f
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    asset: {
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
              type: 'object',
              properties: {
                size: {
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['size'],
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
              type: 'object',
              properties: {
                size: {
                  type: 'string',
                  minLength: 1,
                },
              },
              required: ['size'],
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
        tags: {
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
      },
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
        '_id',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'file',
        'tags',
        'canAccess',
      ],
    },
  },
  required: ['status', 'asset'],
};

module.exports = { schema };
