// automatic hash: 96aec05c48ffdeffd60de2dc72627c81dd31bec53afecf3b8c001edb1385aea6
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
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
        credits: {},
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
        numberOfSubstages: {
          type: 'number',
        },
        maxSubstageAbbreviationIsOnlyNumbers: {
          type: 'boolean',
        },
        haveKnowledge: {
          type: 'boolean',
        },
        treeType: {
          type: 'number',
        },
        totalHours: {},
        hideStudentsToStudents: {
          type: 'boolean',
        },
        evaluationSystem: {
          type: 'string',
          minLength: 1,
        },
        isArchived: {
          type: 'boolean',
        },
        hasSubjectTypes: {
          type: 'boolean',
        },
        useCustomSubjectIds: {
          type: 'boolean',
        },
        useAutoAssignment: {
          type: 'boolean',
        },
        sequentialCourses: {
          type: 'boolean',
        },
        hoursPerCredit: {},
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
            'isCover',
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
        imageUrl: {
          type: 'string',
          minLength: 1,
        },
        hasKnowledgeAreas: {
          type: 'boolean',
        },
        treeTypeNodes: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        centers: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        groups: {
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
              'isAlone',
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
              metadata: {
                type: 'object',
                properties: {
                  minCredits: {},
                  maxCredits: {},
                },
                required: [],
              },
              isAlone: {
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
            },
          },
        },
        knowledgeAreas: {
          type: 'array',
          items: {
            required: [],
            properties: {},
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
              'name',
              'program',
              'course',
              'color',
              'isDeleted',
              '__v',
              'icon',
              'image',
              'credits',
              'internalId',
              'compiledInternalId',
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
              program: {
                type: 'string',
                minLength: 1,
              },
              course: {
                type: 'string',
                minLength: 1,
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
              icon: {
                type: 'string',
                minLength: 1,
              },
              image: {
                type: 'string',
                minLength: 1,
              },
              courses: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
              credits: {
                type: 'number',
              },
              internalId: {
                type: 'string',
                minLength: 1,
              },
              compiledInternalId: {
                type: 'string',
                minLength: 1,
              },
            },
          },
        },
        subjectTypes: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        substages: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        customSubstages: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        cycles: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        classes: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'id',
              'deploymentID',
              'program',
              'seats',
              'color',
              'virtualUrl',
              'classWithoutGroupId',
              'isDeleted',
              '__v',
            ],
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
                type: 'string',
                minLength: 1,
              },
              seats: {
                type: 'number',
              },
              color: {
                type: 'string',
                minLength: 1,
              },
              virtualUrl: {
                type: 'string',
                minLength: 1,
              },
              classWithoutGroupId: {
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
                  'isCover',
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
                  deploymentID: {
                    type: 'string',
                    minLength: 1,
                  },
                  isDeleted: {
                    type: 'boolean',
                  },
                  program: {
                    type: 'string',
                    minLength: 1,
                  },
                  subject: {
                    type: 'string',
                    minLength: 1,
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
                  course: {
                    type: 'array',
                    items: {
                      required: [],
                      properties: {},
                    },
                  },
                  color: {
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
                      'isCover',
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
                      'isCover',
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
                  courses: {
                    type: 'array',
                    items: {
                      required: [],
                      properties: {},
                    },
                  },
                  subjectType: {},
                },
                required: [
                  '_id',
                  'deploymentID',
                  'isDeleted',
                  'program',
                  'subject',
                  '__v',
                  'createdAt',
                  'credits',
                  'id',
                  'updatedAt',
                  'compiledInternalId',
                  'internalId',
                  'name',
                  'course',
                  'color',
                  'icon',
                  'image',
                  'courses',
                ],
              },
              subjectType: {},
              classes: {},
              parentClass: {},
              knowledges: {},
              substages: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
              courses: {
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
                  metadata: {
                    type: 'object',
                    properties: {
                      minCredits: {},
                      maxCredits: {},
                    },
                    required: [],
                  },
                  isAlone: {
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
                },
                required: [
                  '_id',
                  'id',
                  'deploymentID',
                  'name',
                  'index',
                  'program',
                  'type',
                  'metadata',
                  'isAlone',
                  'isDeleted',
                  'createdAt',
                  'updatedAt',
                  '__v',
                ],
              },
              groups: {},
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
                  required: ['teacher', 'type'],
                  properties: {
                    teacher: {
                      type: 'string',
                      minLength: 1,
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
      },
      required: [
        '_id',
        'id',
        'deploymentID',
        'name',
        'color',
        'abbreviation',
        'maxGroupAbbreviationIsOnlyNumbers',
        'maxNumberOfCourses',
        'courseCredits',
        'hideCoursesInTree',
        'moreThanOneAcademicYear',
        'numberOfSubstages',
        'maxSubstageAbbreviationIsOnlyNumbers',
        'haveKnowledge',
        'treeType',
        'hideStudentsToStudents',
        'evaluationSystem',
        'isArchived',
        'hasSubjectTypes',
        'useCustomSubjectIds',
        'useAutoAssignment',
        'sequentialCourses',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'image',
        'imageUrl',
        'hasKnowledgeAreas',
        'treeTypeNodes',
        'centers',
        'groups',
        'courses',
        'knowledgeAreas',
        'subjects',
        'subjectTypes',
        'substages',
        'customSubstages',
        'cycles',
        'classes',
      ],
    },
  },
  required: ['status', 'program'],
};

module.exports = { schema };
