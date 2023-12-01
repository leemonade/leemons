// automatic hash: 573f3a1b0a0ac69317f95b547e6303c0fdfbb55897700ce622821ce1c9ba572d
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    tree: {
      type: 'object',
      properties: {
        nodeType: {
          type: 'string',
          minLength: 1,
        },
        value: {
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
            managers: {
              type: 'array',
              items: {
                required: [],
                properties: {},
              },
            },
            treeTypeNodes: {
              type: 'array',
              items: {
                required: [],
                properties: {},
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
            'managers',
            'treeTypeNodes',
          ],
        },
        childrens: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: ['nodeType', 'treeId'],
            properties: {
              nodeType: {
                type: 'string',
                minLength: 1,
              },
              value: {
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
                  managers: {
                    type: 'array',
                    items: {
                      required: [],
                      properties: {},
                    },
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
                  'managers',
                ],
              },
              childrens: {
                type: 'array',
                uniqueItems: true,
                minItems: 1,
                items: {
                  required: ['nodeType', 'treeId'],
                  properties: {
                    nodeType: {
                      type: 'string',
                      minLength: 1,
                    },
                    value: {
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
                        managers: {
                          type: 'array',
                          items: {
                            required: [],
                            properties: {},
                          },
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
                        'managers',
                      ],
                    },
                    childrens: {
                      type: 'array',
                      uniqueItems: true,
                      minItems: 1,
                      items: {
                        required: ['nodeType', 'treeId'],
                        properties: {
                          nodeType: {
                            type: 'string',
                            minLength: 1,
                          },
                          value: {
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
                              managers: {
                                type: 'array',
                                items: {
                                  required: [],
                                  properties: {},
                                },
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
                              'managers',
                            ],
                          },
                          childrens: {
                            type: 'array',
                            uniqueItems: true,
                            minItems: 1,
                            items: {
                              required: ['nodeType', 'treeId'],
                              properties: {
                                nodeType: {
                                  type: 'string',
                                  minLength: 1,
                                },
                                value: {
                                  type: 'object',
                                  properties: {
                                    center: {
                                      type: 'string',
                                      minLength: 1,
                                    },
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
                                          required: [
                                            'viewer',
                                            'editor',
                                            'assigner',
                                          ],
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
                                              required: [
                                                'viewer',
                                                'editor',
                                                'assigner',
                                              ],
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
                                              required: [
                                                'viewer',
                                                'editor',
                                                'assigner',
                                              ],
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
                                  required: [
                                    'center',
                                    'id',
                                    '_id',
                                    'deploymentID',
                                    'program',
                                    'seats',
                                    'color',
                                    'isDeleted',
                                    'createdAt',
                                    'updatedAt',
                                    '__v',
                                    'image',
                                    'subject',
                                    'subjectType',
                                    'knowledges',
                                    'substages',
                                    'courses',
                                    'groups',
                                    'students',
                                    'parentStudents',
                                    'schedule',
                                    'teachers',
                                  ],
                                },
                                treeId: {
                                  type: 'string',
                                  minLength: 1,
                                },
                              },
                            },
                          },
                          treeId: {
                            type: 'string',
                            minLength: 1,
                          },
                        },
                      },
                    },
                    treeId: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                },
              },
              treeId: {
                type: 'string',
                minLength: 1,
              },
            },
          },
        },
        treeId: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['nodeType', 'value', 'childrens', 'treeId'],
    },
  },
  required: ['status', 'tree'],
};

module.exports = { schema };
