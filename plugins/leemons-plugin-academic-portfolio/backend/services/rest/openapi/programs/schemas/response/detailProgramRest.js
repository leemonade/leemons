// automatic hash: d148107a01b7ec7963e11242e9ab794bf1d217a2ab8478acd8fa9d7779b33eaa
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
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'id',
              'deploymentID',
              'name',
              'abbreviation',
              'index',
              'program',
              'type',
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
        knowledges: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'id',
              'deploymentID',
              'name',
              'abbreviation',
              'color',
              'icon',
              'program',
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
              'isDeleted',
              '__v',
              'icon',
              'image',
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
            },
          },
        },
        subjectTypes: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'id',
              'deploymentID',
              'name',
              'groupVisibility',
              'program',
              'credits_program',
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
          },
        },
        substages: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'id',
              'deploymentID',
              'name',
              'abbreviation',
              'index',
              'program',
              'type',
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
        'treeTypeNodes',
        'centers',
        'groups',
        'courses',
        'knowledges',
        'subjects',
        'subjectTypes',
        'substages',
        'customSubstages',
        'cycles',
      ],
    },
  },
  required: ['status', 'program'],
};

module.exports = { schema };
