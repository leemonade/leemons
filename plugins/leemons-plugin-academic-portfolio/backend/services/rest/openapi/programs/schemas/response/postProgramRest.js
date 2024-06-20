// automatic hash: 0649cedf463e53ca3a4109c969af86fe6f40a0f485e64251b3c09d877de27784
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
          items: {
            required: [],
            properties: {},
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
      ],
    },
  },
  required: ['status', 'program'],
};

module.exports = { schema };
