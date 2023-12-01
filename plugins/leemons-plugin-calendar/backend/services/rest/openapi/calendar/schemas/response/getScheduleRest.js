// automatic hash: 5230a4424d8144106ab2ea43bebaee6f72be463265f396f8a438b0cdac42515a
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    calendarConfig: {
      type: 'object',
      properties: {
        weekDays: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        minHour: {
          type: 'string',
          minLength: 1,
        },
        maxHour: {
          type: 'string',
          minLength: 1,
        },
        minHourDate: {
          type: 'object',
          properties: {},
          required: [],
        },
        maxHourDate: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      required: [
        'weekDays',
        'minHour',
        'maxHour',
        'minHourDate',
        'maxHourDate',
      ],
    },
    calendarConfigByCourse: {
      type: 'object',
      properties: {
        'lrn:local:academic-portfolio:local:auto-deployment-id:Groups:65565ba4af9700e0114bbaad':
          {
            type: 'object',
            properties: {
              dayWeeks: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
              minHour: {
                type: 'string',
                minLength: 1,
              },
              minHourDate: {
                type: 'object',
                properties: {},
                required: [],
              },
              maxHour: {
                type: 'string',
                minLength: 1,
              },
              maxHourDate: {
                type: 'object',
                properties: {},
                required: [],
              },
              weekDays: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
            },
            required: [
              'dayWeeks',
              'minHour',
              'minHourDate',
              'maxHour',
              'maxHourDate',
              'weekDays',
            ],
          },
        'lrn:local:academic-portfolio:local:auto-deployment-id:Groups:65565ba4af9700e0114bbaa7':
          {
            type: 'object',
            properties: {
              dayWeeks: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
              minHour: {
                type: 'string',
                minLength: 1,
              },
              minHourDate: {
                type: 'object',
                properties: {},
                required: [],
              },
              maxHour: {
                type: 'string',
                minLength: 1,
              },
              maxHourDate: {
                type: 'object',
                properties: {},
                required: [],
              },
              weekDays: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
            },
            required: [
              'dayWeeks',
              'minHour',
              'minHourDate',
              'maxHour',
              'maxHourDate',
              'weekDays',
            ],
          },
      },
      required: [
        'lrn:local:academic-portfolio:local:auto-deployment-id:Groups:65565ba4af9700e0114bbaad',
        'lrn:local:academic-portfolio:local:auto-deployment-id:Groups:65565ba4af9700e0114bbaa7',
      ],
    },
    classes: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: ['id', 'deploymentID', 'seats', 'color', 'isDeleted', '__v'],
        properties: {
          id: {
            type: 'string',
            minLength: 1,
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
          program: {
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
              color: {
                type: 'string',
                minLength: 1,
              },
              abbreviation: {
                type: 'string',
                minLength: 1,
              },
              credits: {
                type: 'number',
              },
              useOneStudentGroup: {
                type: 'boolean',
              },
              maxGroupAbbreviation: {
                type: 'number',
              },
              maxGroupAbbreviationIsOnlyNumbers: {
                type: 'boolean',
              },
              maxNumberOfCourses: {
                type: 'number',
              },
              courseCredits: {
                type: 'number',
              },
              hideCoursesInTree: {
                type: 'boolean',
              },
              moreThanOneAcademicYear: {
                type: 'boolean',
              },
              haveSubstagesPerCourse: {
                type: 'boolean',
              },
              substagesFrequency: {
                type: 'string',
                minLength: 1,
              },
              numberOfSubstages: {
                type: 'number',
              },
              useDefaultSubstagesName: {
                type: 'boolean',
              },
              maxSubstageAbbreviation: {
                type: 'number',
              },
              maxSubstageAbbreviationIsOnlyNumbers: {
                type: 'boolean',
              },
              haveKnowledge: {
                type: 'boolean',
              },
              maxKnowledgeAbbreviation: {
                type: 'number',
              },
              maxKnowledgeAbbreviationIsOnlyNumbers: {
                type: 'boolean',
              },
              subjectsFirstDigit: {
                type: 'string',
                minLength: 1,
              },
              subjectsDigits: {
                type: 'number',
              },
              treeType: {
                type: 'number',
              },
              evaluationSystem: {
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
              image: {
                type: 'string',
                minLength: 1,
              },
              imageUrl: {
                type: 'string',
                minLength: 1,
              },
            },
            required: [
              '_id',
              'id',
              'deploymentID',
              'name',
              'color',
              'abbreviation',
              'credits',
              'useOneStudentGroup',
              'maxGroupAbbreviation',
              'maxGroupAbbreviationIsOnlyNumbers',
              'maxNumberOfCourses',
              'courseCredits',
              'hideCoursesInTree',
              'moreThanOneAcademicYear',
              'haveSubstagesPerCourse',
              'substagesFrequency',
              'numberOfSubstages',
              'useDefaultSubstagesName',
              'maxSubstageAbbreviation',
              'maxSubstageAbbreviationIsOnlyNumbers',
              'haveKnowledge',
              'maxKnowledgeAbbreviation',
              'maxKnowledgeAbbreviationIsOnlyNumbers',
              'subjectsFirstDigit',
              'subjectsDigits',
              'treeType',
              'evaluationSystem',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
              'image',
              'imageUrl',
            ],
          },
          seats: {
            type: 'number',
          },
          color: {
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
          image: {
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
                  assigner: {
                    type: 'array',
                    items: {
                      required: [],
                      properties: {},
                    },
                  },
                },
                required: ['viewer', 'editor', 'assigner'],
              },
              duplicable: {
                type: 'boolean',
              },
              assignable: {},
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
            },
            required: [
              '_id',
              'id',
              'deploymentID',
              'name',
              'fromUser',
              'fromUserAgent',
              'public',
              'category',
              'indexable',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
              'permissions',
              'duplicable',
              'downloadable',
              'tags',
              'pinned',
            ],
          },
          subject: {
            type: 'object',
            properties: {
              _id: {
                type: 'object',
                properties: {
                  valueOf: {},
                },
                required: ['valueOf'],
              },
              subject: {
                type: 'string',
                minLength: 1,
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              deploymentID: {
                type: 'string',
                minLength: 1,
              },
              isDeleted: {
                type: 'boolean',
              },
              __v: {
                type: 'number',
              },
              createdAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              credits: {
                type: 'number',
              },
              deletedAt: {},
              id: {
                type: 'string',
                minLength: 1,
              },
              updatedAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              compiledInternalId: {
                type: 'string',
                minLength: 1,
              },
              internalId: {
                type: 'string',
                minLength: 1,
              },
              name: {
                type: 'string',
                minLength: 1,
              },
              icon: {
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
                      assigner: {
                        type: 'array',
                        items: {
                          required: [],
                          properties: {},
                        },
                      },
                    },
                    required: ['viewer', 'editor', 'assigner'],
                  },
                  duplicable: {
                    type: 'boolean',
                  },
                  assignable: {},
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
                  'isDeleted',
                  'createdAt',
                  'updatedAt',
                  '__v',
                  'permissions',
                  'duplicable',
                  'downloadable',
                  'tags',
                  'pinned',
                ],
              },
              image: {
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
                      assigner: {
                        type: 'array',
                        items: {
                          required: [],
                          properties: {},
                        },
                      },
                    },
                    required: ['viewer', 'editor', 'assigner'],
                  },
                  duplicable: {
                    type: 'boolean',
                  },
                  assignable: {},
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
                  'isDeleted',
                  'createdAt',
                  'updatedAt',
                  '__v',
                  'permissions',
                  'duplicable',
                  'downloadable',
                  'tags',
                  'pinned',
                ],
              },
              color: {
                type: 'string',
                minLength: 1,
              },
            },
            required: [
              '_id',
              'subject',
              'program',
              'deploymentID',
              'isDeleted',
              '__v',
              'createdAt',
              'credits',
              'id',
              'updatedAt',
              'compiledInternalId',
              'internalId',
              'name',
              'icon',
              'image',
              'color',
            ],
          },
          subjectType: {
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
              groupVisibility: {
                type: 'boolean',
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              credits_program: {
                type: 'number',
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
              'groupVisibility',
              'program',
              'credits_program',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
            ],
          },
          classes: {},
          parentClass: {},
          knowledges: {
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
              abbreviation: {
                type: 'string',
                minLength: 1,
              },
              color: {
                type: 'string',
                minLength: 1,
              },
              icon: {
                type: 'string',
                minLength: 1,
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              credits_program: {},
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
              'abbreviation',
              'color',
              'icon',
              'program',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
            ],
          },
          substages: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          courses: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: [
                'id',
                'deploymentID',
                'name',
                'index',
                'program',
                'type',
                'number',
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
                name: {
                  type: 'string',
                  minLength: 1,
                },
                index: {
                  type: 'number',
                },
                program: {
                  type: 'string',
                  minLength: 1,
                },
                type: {
                  type: 'string',
                  minLength: 1,
                },
                number: {
                  type: 'number',
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
          groups: {
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
              abbreviation: {
                type: 'string',
                minLength: 1,
              },
              index: {
                type: 'number',
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              type: {
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
              'abbreviation',
              'index',
              'program',
              'type',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
            ],
          },
          students: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          parentStudents: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          schedule: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: [
                'id',
                'deploymentID',
                'class',
                'day',
                'dayWeek',
                'start',
                'end',
                'duration',
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
                class: {
                  type: 'string',
                  minLength: 1,
                },
                day: {
                  type: 'string',
                  minLength: 1,
                },
                dayWeek: {
                  type: 'number',
                },
                start: {
                  type: 'string',
                  minLength: 1,
                },
                end: {
                  type: 'string',
                  minLength: 1,
                },
                duration: {
                  type: 'number',
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
          teachers: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: ['type'],
              properties: {
                teacher: {
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
                  },
                  required: ['_id', 'id', 'user', 'role', 'disabled'],
                },
                type: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
          },
        },
      },
    },
    allClasses: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: ['id', 'deploymentID', 'seats', 'color', 'isDeleted', '__v'],
        properties: {
          id: {
            type: 'string',
            minLength: 1,
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
          program: {
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
              color: {
                type: 'string',
                minLength: 1,
              },
              abbreviation: {
                type: 'string',
                minLength: 1,
              },
              credits: {
                type: 'number',
              },
              useOneStudentGroup: {
                type: 'boolean',
              },
              maxGroupAbbreviation: {
                type: 'number',
              },
              maxGroupAbbreviationIsOnlyNumbers: {
                type: 'boolean',
              },
              maxNumberOfCourses: {
                type: 'number',
              },
              courseCredits: {
                type: 'number',
              },
              hideCoursesInTree: {
                type: 'boolean',
              },
              moreThanOneAcademicYear: {
                type: 'boolean',
              },
              haveSubstagesPerCourse: {
                type: 'boolean',
              },
              substagesFrequency: {
                type: 'string',
                minLength: 1,
              },
              numberOfSubstages: {
                type: 'number',
              },
              useDefaultSubstagesName: {
                type: 'boolean',
              },
              maxSubstageAbbreviation: {
                type: 'number',
              },
              maxSubstageAbbreviationIsOnlyNumbers: {
                type: 'boolean',
              },
              haveKnowledge: {
                type: 'boolean',
              },
              maxKnowledgeAbbreviation: {
                type: 'number',
              },
              maxKnowledgeAbbreviationIsOnlyNumbers: {
                type: 'boolean',
              },
              subjectsFirstDigit: {
                type: 'string',
                minLength: 1,
              },
              subjectsDigits: {
                type: 'number',
              },
              treeType: {
                type: 'number',
              },
              evaluationSystem: {
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
              image: {
                type: 'string',
                minLength: 1,
              },
              imageUrl: {
                type: 'string',
                minLength: 1,
              },
            },
            required: [
              '_id',
              'id',
              'deploymentID',
              'name',
              'color',
              'abbreviation',
              'credits',
              'useOneStudentGroup',
              'maxGroupAbbreviation',
              'maxGroupAbbreviationIsOnlyNumbers',
              'maxNumberOfCourses',
              'courseCredits',
              'hideCoursesInTree',
              'moreThanOneAcademicYear',
              'haveSubstagesPerCourse',
              'substagesFrequency',
              'numberOfSubstages',
              'useDefaultSubstagesName',
              'maxSubstageAbbreviation',
              'maxSubstageAbbreviationIsOnlyNumbers',
              'haveKnowledge',
              'maxKnowledgeAbbreviation',
              'maxKnowledgeAbbreviationIsOnlyNumbers',
              'subjectsFirstDigit',
              'subjectsDigits',
              'treeType',
              'evaluationSystem',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
              'image',
              'imageUrl',
            ],
          },
          seats: {
            type: 'number',
          },
          color: {
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
          image: {
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
                  assigner: {
                    type: 'array',
                    items: {
                      required: [],
                      properties: {},
                    },
                  },
                },
                required: ['viewer', 'editor', 'assigner'],
              },
              duplicable: {
                type: 'boolean',
              },
              assignable: {},
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
            },
            required: [
              '_id',
              'id',
              'deploymentID',
              'name',
              'fromUser',
              'fromUserAgent',
              'public',
              'category',
              'indexable',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
              'permissions',
              'duplicable',
              'downloadable',
              'tags',
              'pinned',
            ],
          },
          subject: {
            type: 'object',
            properties: {
              _id: {
                type: 'object',
                properties: {
                  valueOf: {},
                },
                required: ['valueOf'],
              },
              subject: {
                type: 'string',
                minLength: 1,
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              deploymentID: {
                type: 'string',
                minLength: 1,
              },
              isDeleted: {
                type: 'boolean',
              },
              __v: {
                type: 'number',
              },
              createdAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              credits: {
                type: 'number',
              },
              deletedAt: {},
              id: {
                type: 'string',
                minLength: 1,
              },
              updatedAt: {
                type: 'object',
                properties: {},
                required: [],
              },
              compiledInternalId: {
                type: 'string',
                minLength: 1,
              },
              internalId: {
                type: 'string',
                minLength: 1,
              },
              name: {
                type: 'string',
                minLength: 1,
              },
              icon: {
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
                      assigner: {
                        type: 'array',
                        items: {
                          required: [],
                          properties: {},
                        },
                      },
                    },
                    required: ['viewer', 'editor', 'assigner'],
                  },
                  duplicable: {
                    type: 'boolean',
                  },
                  assignable: {},
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
                  'isDeleted',
                  'createdAt',
                  'updatedAt',
                  '__v',
                  'permissions',
                  'duplicable',
                  'downloadable',
                  'tags',
                  'pinned',
                ],
              },
              image: {
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
                      assigner: {
                        type: 'array',
                        items: {
                          required: [],
                          properties: {},
                        },
                      },
                    },
                    required: ['viewer', 'editor', 'assigner'],
                  },
                  duplicable: {
                    type: 'boolean',
                  },
                  assignable: {},
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
                  'isDeleted',
                  'createdAt',
                  'updatedAt',
                  '__v',
                  'permissions',
                  'duplicable',
                  'downloadable',
                  'tags',
                  'pinned',
                ],
              },
              color: {
                type: 'string',
                minLength: 1,
              },
            },
            required: [
              '_id',
              'subject',
              'program',
              'deploymentID',
              'isDeleted',
              '__v',
              'createdAt',
              'credits',
              'id',
              'updatedAt',
              'compiledInternalId',
              'internalId',
              'name',
              'icon',
              'image',
              'color',
            ],
          },
          subjectType: {
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
              groupVisibility: {
                type: 'boolean',
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              credits_program: {
                type: 'number',
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
              'groupVisibility',
              'program',
              'credits_program',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
            ],
          },
          classes: {},
          parentClass: {},
          knowledges: {
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
              abbreviation: {
                type: 'string',
                minLength: 1,
              },
              color: {
                type: 'string',
                minLength: 1,
              },
              icon: {
                type: 'string',
                minLength: 1,
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              credits_program: {},
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
              'abbreviation',
              'color',
              'icon',
              'program',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
            ],
          },
          substages: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          courses: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: [
                'id',
                'deploymentID',
                'name',
                'index',
                'program',
                'type',
                'number',
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
                name: {
                  type: 'string',
                  minLength: 1,
                },
                index: {
                  type: 'number',
                },
                program: {
                  type: 'string',
                  minLength: 1,
                },
                type: {
                  type: 'string',
                  minLength: 1,
                },
                number: {
                  type: 'number',
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
          groups: {
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
              abbreviation: {
                type: 'string',
                minLength: 1,
              },
              index: {
                type: 'number',
              },
              program: {
                type: 'string',
                minLength: 1,
              },
              type: {
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
              'abbreviation',
              'index',
              'program',
              'type',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
            ],
          },
          students: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          parentStudents: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          schedule: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: [
                'id',
                'deploymentID',
                'class',
                'day',
                'dayWeek',
                'start',
                'end',
                'duration',
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
                class: {
                  type: 'string',
                  minLength: 1,
                },
                day: {
                  type: 'string',
                  minLength: 1,
                },
                dayWeek: {
                  type: 'number',
                },
                start: {
                  type: 'string',
                  minLength: 1,
                },
                end: {
                  type: 'string',
                  minLength: 1,
                },
                duration: {
                  type: 'number',
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
          teachers: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              required: ['type'],
              properties: {
                teacher: {
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
                  },
                  required: ['_id', 'id', 'user', 'role', 'disabled'],
                },
                type: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
          },
        },
      },
    },
    allCourses: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'name',
          'index',
          'program',
          'type',
          'number',
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
          name: {
            type: 'string',
            minLength: 1,
          },
          index: {
            type: 'number',
          },
          program: {
            type: 'string',
            minLength: 1,
          },
          type: {
            type: 'string',
            minLength: 1,
          },
          number: {
            type: 'number',
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
    courses: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'name',
          'index',
          'program',
          'type',
          'number',
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
          name: {
            type: 'string',
            minLength: 1,
          },
          index: {
            type: 'number',
          },
          program: {
            type: 'string',
            minLength: 1,
          },
          type: {
            type: 'string',
            minLength: 1,
          },
          number: {
            type: 'number',
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
    config: {},
  },
  required: [
    'status',
    'calendarConfig',
    'calendarConfigByCourse',
    'classes',
    'allClasses',
    'allCourses',
    'courses',
  ],
};

module.exports = { schema };
