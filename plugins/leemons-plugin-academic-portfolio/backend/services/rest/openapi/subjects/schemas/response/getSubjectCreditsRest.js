// automatic hash: b869886212ab1356e1f91936f4cd03192f9dbf46022406aa9e81460579ba5fed
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    subjectsCredits: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'deploymentID',
          'program',
          'subject',
          'isDeleted',
          '__v',
          'credits',
          'id',
          'compiledInternalId',
          'internalId',
        ],
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
          program: {
            type: 'string',
            minLength: 1,
          },
          subject: {
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
        },
      },
    },
  },
  required: ['status', 'subjectsCredits'],
};

module.exports = { schema };
