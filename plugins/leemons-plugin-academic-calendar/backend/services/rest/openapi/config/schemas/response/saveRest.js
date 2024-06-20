// automatic hash: 4e660eb91faef45f4783b8ef3cb98a33516425f3b85b424d9d1fec240acdd1fc
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    config: {
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
        __v: {
          type: 'number',
        },
        courseDates: {
          type: 'object',
          properties: {
            'lrn:local:academic-portfolio:local:662f652a421c6b5e1e839b6c:Groups:662f65cd9f06d6bbeb628209':
              {
                type: 'object',
                properties: {
                  startDate: {
                    type: 'string',
                    minLength: 1,
                  },
                  endDate: {
                    type: 'string',
                    minLength: 1,
                  },
                },
                required: ['startDate', 'endDate'],
              },
          },
          required: [
            'lrn:local:academic-portfolio:local:662f652a421c6b5e1e839b6c:Groups:662f65cd9f06d6bbeb628209',
          ],
        },
        courseEvents: {
          type: 'object',
          properties: {
            'lrn:local:academic-portfolio:local:662f652a421c6b5e1e839b6c:Groups:662f65cd9f06d6bbeb628209':
              {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
          },
          required: [
            'lrn:local:academic-portfolio:local:662f652a421c6b5e1e839b6c:Groups:662f65cd9f06d6bbeb628209',
          ],
        },
        createdAt: {
          type: 'object',
          properties: {},
          required: [],
        },
        deletedAt: {},
        id: {
          type: 'string',
          minLength: 1,
        },
        regionalConfig: {
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
            center: {
              type: 'string',
              minLength: 1,
            },
            regionalEvents: {
              type: 'array',
              items: {
                required: [],
                properties: {},
              },
            },
            localEvents: {
              type: 'array',
              items: {
                required: [],
                properties: {},
              },
            },
            daysOffEvents: {
              type: 'array',
              items: {
                required: [],
                properties: {},
              },
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
            'center',
            'regionalEvents',
            'localEvents',
            'daysOffEvents',
            'isDeleted',
            'createdAt',
            'updatedAt',
            '__v',
          ],
        },
        substagesDates: {
          type: 'object',
          properties: {
            'lrn:local:academic-portfolio:local:662f652a421c6b5e1e839b6c:Groups:662f65cd9f06d6bbeb628209':
              {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
          },
          required: [
            'lrn:local:academic-portfolio:local:662f652a421c6b5e1e839b6c:Groups:662f65cd9f06d6bbeb628209',
          ],
        },
        updatedAt: {
          type: 'object',
          properties: {},
          required: [],
        },
        allCoursesHaveSameConfig: {
          type: 'boolean',
        },
        allCoursesHaveSameDates: {
          type: 'boolean',
        },
        allCoursesHaveSameDays: {
          type: 'boolean',
        },
        breaks: {},
      },
      required: [
        '_id',
        'deploymentID',
        'isDeleted',
        'program',
        '__v',
        'courseDates',
        'courseEvents',
        'createdAt',
        'id',
        'regionalConfig',
        'substagesDates',
        'updatedAt',
        'allCoursesHaveSameConfig',
        'allCoursesHaveSameDates',
        'allCoursesHaveSameDays',
      ],
    },
  },
  required: ['status', 'config'],
};

module.exports = { schema };
