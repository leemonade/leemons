// automatic hash: 0e891a9328f00b3279d67248012c091d6d4dcf50965f55bc49e56c8c3b7017d8
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    menu: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'menuKey',
          'key',
          'pluginName',
          'order',
          'fixed',
          'iconSvg',
          'activeIconSvg',
          'url',
          'window',
          'isDeleted',
          '__v',
          'label',
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
          menuKey: {
            type: 'string',
            minLength: 1,
          },
          key: {
            type: 'string',
            minLength: 1,
          },
          pluginName: {
            type: 'string',
            minLength: 1,
          },
          order: {
            type: 'number',
          },
          fixed: {
            type: 'boolean',
          },
          iconSvg: {
            type: 'string',
            minLength: 1,
          },
          activeIconSvg: {
            type: 'string',
            minLength: 1,
          },
          url: {
            type: 'string',
            minLength: 1,
          },
          window: {
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
          label: {
            type: 'string',
            minLength: 1,
          },
          children: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
          customChildren: {
            type: 'array',
            items: {
              required: [],
              properties: {},
            },
          },
        },
      },
    },
  },
  required: ['status', 'menu'],
};

module.exports = { schema };
