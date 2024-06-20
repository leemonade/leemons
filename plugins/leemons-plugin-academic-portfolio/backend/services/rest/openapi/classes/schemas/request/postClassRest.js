// automatic hash: 0c505b5cd7ae1f30f3c196ae40dd1b6687ec609a1f5f0a56ca9c4470c0d00d2a
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    subject: {
      type: 'string',
      minLength: 1,
    },
    color: {
      type: 'string',
      minLength: 1,
    },
    seats: {
      type: 'number',
    },
    virtualUrl: {
      type: 'string',
      minLength: 1,
    },
    program: {
      type: 'string',
      minLength: 1,
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
    schedule: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: ['start', 'end', 'duration', 'day', 'dayWeek'],
        properties: {
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
          day: {
            type: 'string',
            minLength: 1,
          },
          dayWeek: {
            type: 'number',
          },
        },
      },
    },
    classWithoutGroupId: {
      type: 'string',
      minLength: 1,
    },
  },
  required: [
    'subject',
    'color',
    'seats',
    'virtualUrl',
    'program',
    'teachers',
    'schedule',
    'classWithoutGroupId',
  ],
};

module.exports = { schema };
