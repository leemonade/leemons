// automatic hash: 6668413c5a1b5b48b7aa7ee17c15de8d17d3ef1f46bf94a28657de9defd89aaf
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    test: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          minLength: 1,
        },
        asset: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 1,
            },
            tagline: {
              type: 'string',
              minLength: 1,
            },
            description: {},
            color: {
              type: 'string',
              minLength: 1,
            },
            cover: {
              type: 'string',
              minLength: 1,
            },
            tags: {
              type: 'array',
              items: {
                required: [],
                properties: {},
              },
            },
            indexable: {
              type: 'boolean',
            },
            public: {
              type: 'boolean',
            },
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
            pinned: {
              type: 'boolean',
            },
          },
          required: [
            'name',
            'tagline',
            'color',
            'cover',
            'tags',
            'indexable',
            'public',
            '_id',
            'id',
            'deploymentID',
            'fromUser',
            'fromUserAgent',
            'category',
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
            'pinned',
          ],
        },
        gradable: {
          type: 'boolean',
        },
        subjects: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: ['subject', 'program'],
            properties: {
              subject: {
                type: 'string',
                minLength: 1,
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              curriculum: {
                type: 'object',
                properties: {},
                required: [],
              },
            },
          },
        },
        statement: {
          type: 'string',
          minLength: 1,
        },
        instructionsForTeachers: {},
        instructionsForStudents: {},
        metadata: {
          type: 'object',
          properties: {
            questionBank: {
              type: 'string',
              minLength: 1,
            },
            filters: {
              type: 'object',
              properties: {
                useAllQuestions: {
                  type: 'boolean',
                },
              },
              required: ['useAllQuestions'],
            },
            questions: {
              type: 'array',
              items: {
                required: [],
                properties: {},
              },
            },
            type: {
              type: 'string',
              minLength: 1,
            },
            level: {},
          },
          required: ['questionBank', 'filters', 'questions', 'type'],
        },
        _id: {
          type: 'object',
          properties: {
            valueOf: {},
          },
          required: ['valueOf'],
        },
        deploymentID: {
          type: 'string',
          minLength: 1,
        },
        role: {
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
      },
      required: [
        'id',
        'asset',
        'gradable',
        'subjects',
        'statement',
        'metadata',
        '_id',
        'deploymentID',
        'role',
        'resources',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'published',
        'roleDetails',
      ],
    },
  },
  required: ['status', 'test'],
};

module.exports = { schema };
