// automatic hash: 31e9fe3066f2c776acbc698205e00725bca91edde941cb7cd2707decc401917e
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    programs: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
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
          '__v',
          'imageUrl',
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
        },
      },
    },
  },
  required: ['status', 'programs'],
};

module.exports = { schema };
