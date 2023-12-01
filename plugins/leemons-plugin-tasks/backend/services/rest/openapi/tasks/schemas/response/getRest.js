// automatic hash: fb1370e0d0c52d64068b12a6658b255cf3b211c52088cea0037364d06afd210a
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    task: {
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
        asset: {
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
            tagline: {
              type: 'string',
              minLength: 1,
            },
            description: {
              type: 'string',
              minLength: 1,
            },
            color: {
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
            program: {
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
            subjects: {
              type: 'array',
              uniqueItems: true,
              minItems: 1,
              items: {
                required: [
                  'id',
                  'deploymentID',
                  'asset',
                  'subject',
                  'level',
                  'isDeleted',
                  '__v',
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
                  asset: {
                    type: 'string',
                    minLength: 1,
                  },
                  subject: {
                    type: 'string',
                    minLength: 1,
                  },
                  level: {
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
            programName: {
              type: 'string',
              minLength: 1,
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
            assignable: {},
            downloadable: {
              type: 'boolean',
            },
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
          },
          required: [
            '_id',
            'id',
            'deploymentID',
            'name',
            'tagline',
            'description',
            'color',
            'cover',
            'fromUser',
            'fromUserAgent',
            'public',
            'category',
            'indexable',
            'program',
            'isDeleted',
            'createdAt',
            'updatedAt',
            '__v',
            'subjects',
            'programName',
            'permissions',
            'duplicable',
            'downloadable',
            'tags',
            'pinned',
          ],
        },
        role: {
          type: 'string',
          minLength: 1,
        },
        gradable: {
          type: 'boolean',
        },
        center: {
          type: 'string',
          minLength: 1,
        },
        statement: {
          type: 'string',
          minLength: 1,
        },
        duration: {
          type: 'string',
          minLength: 1,
        },
        resources: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        submission: {},
        instructionsForTeachers: {},
        instructionsForStudents: {},
        metadata: {
          type: 'object',
          properties: {
            development: {
              type: 'array',
              uniqueItems: true,
              minItems: 1,
              items: {
                required: ['development'],
                properties: {
                  development: {
                    type: 'string',
                    minLength: 1,
                  },
                },
              },
            },
          },
          required: ['development'],
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
        published: {
          type: 'boolean',
        },
        roleDetails: {
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
            teacherDetailUrl: {
              type: 'string',
              minLength: 1,
            },
            studentDetailUrl: {
              type: 'string',
              minLength: 1,
            },
            evaluationDetailUrl: {
              type: 'string',
              minLength: 1,
            },
            previewUrl: {
              type: 'string',
              minLength: 1,
            },
            plugin: {
              type: 'string',
              minLength: 1,
            },
            icon: {
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
            'teacherDetailUrl',
            'studentDetailUrl',
            'evaluationDetailUrl',
            'previewUrl',
            'plugin',
            'icon',
            'isDeleted',
            'createdAt',
            'updatedAt',
            '__v',
          ],
        },
        subjects: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: ['program', 'subject', 'level'],
            properties: {
              program: {
                type: 'string',
                minLength: 1,
              },
              subject: {
                type: 'string',
                minLength: 1,
              },
              level: {
                type: 'string',
                minLength: 1,
              },
              curriculum: {
                type: 'object',
                properties: {
                  objectives: {
                    type: 'array',
                    items: {
                      required: [],
                      properties: {},
                    },
                  },
                },
                required: ['objectives'],
              },
            },
          },
        },
      },
      required: [
        '_id',
        'id',
        'deploymentID',
        'asset',
        'role',
        'gradable',
        'center',
        'statement',
        'duration',
        'resources',
        'metadata',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'published',
        'roleDetails',
        'subjects',
      ],
    },
  },
  required: ['status', 'task'],
};

module.exports = { schema };
