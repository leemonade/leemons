// automatic hash: db686fa3f70afd5c115bc8d79c90c8121ea73ef33163e080b60094b013276334
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
          '__v',
          'isPrivate',
          'programName',
          'duplicable',
          'assignable',
          'downloadable',
          'pinned',
          'editable',
          'deleteable',
          'shareable',
          'role',
          'prepared',
          'pinneable',
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
          assignable: {
            type: 'boolean',
          },
          downloadable: {
            type: 'boolean',
          },
          providerData: {
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
                type: 'string',
                minLength: 1,
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
              submission: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    minLength: 1,
                  },
                  data: {
                    type: 'object',
                    properties: {
                      maxSize: {
                        type: 'number',
                      },
                      extensions: {
                        type: 'object',
                        properties: {
                          '.docx': {
                            type: 'string',
                            minLength: 1,
                          },
                        },
                        required: ['.docx'],
                      },
                      multipleFiles: {
                        type: 'boolean',
                      },
                    },
                    required: ['maxSize', 'extensions', 'multipleFiles'],
                  },
                  description: {
                    type: 'string',
                    minLength: 1,
                  },
                },
                required: ['type', 'data', 'description'],
              },
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
              'submission',
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
              assignable: {
                type: 'boolean',
              },
              downloadable: {
                type: 'boolean',
              },
              providerData: {
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
                    type: 'string',
                    minLength: 1,
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
                  submission: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'string',
                        minLength: 1,
                      },
                      data: {
                        type: 'object',
                        properties: {
                          maxSize: {
                            type: 'number',
                          },
                          extensions: {
                            type: 'object',
                            properties: {
                              '.docx': {
                                type: 'string',
                                minLength: 1,
                              },
                            },
                            required: ['.docx'],
                          },
                          multipleFiles: {
                            type: 'boolean',
                          },
                        },
                        required: ['maxSize', 'extensions', 'multipleFiles'],
                      },
                      description: {
                        type: 'string',
                        minLength: 1,
                      },
                    },
                    required: ['type', 'data', 'description'],
                  },
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
                  'submission',
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
              'isPrivate',
              'classesCanAccess',
              'canAccess',
              'subjects',
              'programName',
              'permissions',
              'duplicable',
              'assignable',
              'downloadable',
              'providerData',
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
          pinneable: {
            type: 'boolean',
          },
        },
      },
    },
  },
  required: ['status', 'assets'],
};

module.exports = { schema };
