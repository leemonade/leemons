// automatic hash: d8e27350dc8a218d85fe0c99241bb62e9bf2a96b3efb54ae36f043e01204b232
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    locale: {
      type: 'string',
      minLength: 1,
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    timezone: {
      type: 'string',
      minLength: 1,
    },
    firstDayOfWeek: {
      type: 'string',
      minLength: 1,
    },
    country: {
      type: 'string',
      minLength: 1,
    },
    city: {
      type: 'string',
      minLength: 1,
    },
    postalCode: {
      type: 'string',
      minLength: 1,
    },
    street: {
      type: 'string',
      minLength: 1,
    },
    adminProfile: {
      type: 'string',
      minLength: 1,
    },
    teacherProfile: {
      type: 'string',
      minLength: 1,
    },
    studentProfile: {
      type: 'string',
      minLength: 1,
    },
    limits: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: ['item', 'limit', 'type'],
        properties: {
          item: {
            type: 'string',
            minLength: 1,
          },
          limit: {
            type: 'number',
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
    'locale',
    'name',
    'timezone',
    'firstDayOfWeek',
    'country',
    'city',
    'postalCode',
    'street',
    'adminProfile',
    'teacherProfile',
    'studentProfile',
    'limits',
  ],
};

module.exports = { schema };
