// automatic hash: f45b113d1f3671ceb0cae9cbf6e8bc9e8760cf0dafee48012088763d380e1732
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    categories: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'key',
          'pluginOwner',
          'creatable',
          'createUrl',
          'duplicable',
          'provider',
          'componentOwner',
          'listCardComponent',
          'detailComponent',
          'canUse',
          'order',
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
          key: {
            type: 'string',
            minLength: 1,
          },
          pluginOwner: {
            type: 'string',
            minLength: 1,
          },
          creatable: {
            type: 'boolean',
          },
          createUrl: {
            type: 'string',
            minLength: 1,
          },
          duplicable: {
            type: 'boolean',
          },
          provider: {
            type: 'string',
            minLength: 1,
          },
          componentOwner: {
            type: 'string',
            minLength: 1,
          },
          listCardComponent: {
            type: 'string',
            minLength: 1,
          },
          detailComponent: {
            type: 'string',
            minLength: 1,
          },
          canUse: {
            type: 'string',
            minLength: 1,
          },
          order: {
            type: 'number',
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
          menuItem: {
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
            required: [
              '_id',
              'id',
              'deploymentID',
              'menuKey',
              'key',
              'pluginName',
              'order',
              'fixed',
              'iconSvg',
              'activeIconSvg',
              'window',
              'isDeleted',
              'createdAt',
              'updatedAt',
              '__v',
              'label',
              'children',
              'customChildren',
            ],
          },
        },
      },
    },
  },
  required: ['status', 'categories'],
};

module.exports = { schema };
