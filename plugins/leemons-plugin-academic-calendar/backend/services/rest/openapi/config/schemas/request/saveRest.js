// automatic hash: 0f7817644465c64df7309677d6aa023c21e7683974cd6dd6a1b3bcb29eb8ef29
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    regionalConfig: {
      type: 'string',
      minLength: 1,
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
    program: {
      type: 'string',
      minLength: 1,
    },
  },
  required: [
    'regionalConfig',
    'courseDates',
    'substagesDates',
    'courseEvents',
    'program',
  ],
};

module.exports = { schema };
