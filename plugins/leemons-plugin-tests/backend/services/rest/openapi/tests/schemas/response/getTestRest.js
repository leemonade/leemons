// automatic hash: aae18b086a51b0e7d3cf6218d0b5f550a3b27b077ee95e74a1396ca46db912a0
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
        name: {
          type: 'string',
          minLength: 1,
        },
        description: {},
        tagline: {
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
        tags: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        program: {
          type: 'string',
          minLength: 1,
        },
        subjects: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        statement: {
          type: 'string',
          minLength: 1,
        },
        instructionsForTeachers: {},
        instructionsForStudents: {},
        gradable: {
          type: 'boolean',
        },
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
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'id',
              'deploymentID',
              'questionBank',
              'type',
              'withImages',
              'level',
              'question',
              'questionImage',
              'clues',
              'category',
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
              questionBank: {
                type: 'string',
                minLength: 1,
              },
              type: {
                type: 'string',
                minLength: 1,
              },
              withImages: {
                type: 'boolean',
              },
              level: {
                type: 'string',
                minLength: 1,
              },
              question: {
                type: 'string',
                minLength: 1,
              },
              questionImage: {
                type: 'string',
                minLength: 1,
              },
              clues: {
                type: 'string',
                minLength: 1,
              },
              category: {
                type: 'string',
                minLength: 1,
              },
              properties: {
                type: 'object',
                properties: {
                  explanationInResponses: {
                    type: 'boolean',
                  },
                  explanation: {
                    type: 'string',
                    minLength: 1,
                  },
                  responses: {
                    type: 'array',
                    uniqueItems: true,
                    minItems: 1,
                    items: {
                      required: [],
                      properties: {
                        value: {
                          type: 'object',
                          properties: {
                            explanation: {
                              type: 'string',
                              minLength: 1,
                            },
                            isCorrectResponse: {
                              type: 'boolean',
                            },
                            hideOnHelp: {
                              type: 'boolean',
                            },
                            response: {
                              type: 'string',
                              minLength: 1,
                            },
                          },
                          required: [
                            'explanation',
                            'isCorrectResponse',
                            'hideOnHelp',
                            'response',
                          ],
                        },
                      },
                    },
                  },
                },
                required: [
                  'explanationInResponses',
                  'explanation',
                  'responses',
                ],
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
        type: {
          type: 'string',
          minLength: 1,
        },
        levels: {},
        curriculum: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      required: [
        'id',
        'name',
        'tagline',
        'color',
        'cover',
        'tags',
        'program',
        'subjects',
        'statement',
        'gradable',
        'questionBank',
        'filters',
        'questions',
        'type',
        'curriculum',
      ],
    },
  },
  required: ['status', 'test'],
};

module.exports = { schema };
