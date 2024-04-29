// automatic hash: dda9295181fe2c7e822f4348dbeeae80a74206cfec7b404d34baf19f75f7dd55
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    regionalConfigs: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'name',
          'center',
          'isDeleted',
          '__v',
          'assignedToAProgram',
          'currentlyInUse',
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
          assignedToAProgram: {
            type: 'boolean',
          },
          currentlyInUse: {
            type: 'boolean',
          },
        },
      },
    },
  },
  required: ['status', 'regionalConfigs'],
};

module.exports = { schema };
