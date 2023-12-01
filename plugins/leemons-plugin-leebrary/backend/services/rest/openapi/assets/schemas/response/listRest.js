// automatic hash: 84e284c7fa7a6603d5285008fd18b2d6d3e89b4fb2e6426683026a34ed170c9e
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    assets: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: ['asset', 'role'],
        properties: {
          asset: {
            type: 'string',
            minLength: 1,
          },
          role: {
            type: 'string',
            minLength: 1,
          },
          permissions: {
            type: 'object',
            properties: {
              view: {
                type: 'boolean',
              },
              assign: {
                type: 'boolean',
              },
              comment: {
                type: 'boolean',
              },
              edit: {
                type: 'boolean',
              },
              delete: {
                type: 'boolean',
              },
              duplicate: {
                type: 'boolean',
              },
              canAssign: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
              canUnassign: {
                type: 'array',
                items: {
                  required: [],
                  properties: {},
                },
              },
            },
            required: [
              'view',
              'assign',
              'comment',
              'edit',
              'delete',
              'duplicate',
              'canAssign',
              'canUnassign',
            ],
          },
        },
      },
    },
  },
  required: ['status', 'assets'],
};

module.exports = { schema };
