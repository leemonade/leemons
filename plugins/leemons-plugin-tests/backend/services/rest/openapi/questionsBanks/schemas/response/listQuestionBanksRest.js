// automatic hash: 4064bbbe20005c04948e98d78c3d74fbd78bfd91dcff34a383101c82307aabb4
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    data: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          uniqueItems: true,
          minItems: 1,
          items: {
            required: [
              'id',
              'deploymentID',
              'name',
              'program',
              'published',
              'isDeleted',
              '__v',
              'asset',
              'nQuestions',
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
              program: {
                type: 'string',
                minLength: 1,
              },
              published: {
                type: 'boolean',
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
              asset: {
                type: 'string',
                minLength: 1,
              },
              nQuestions: {
                type: 'number',
              },
            },
          },
        },
        count: {
          type: 'number',
        },
        totalCount: {
          type: 'number',
        },
        totalPages: {
          type: 'number',
        },
        page: {
          type: 'number',
        },
        size: {
          type: 'number',
        },
        nextPage: {
          type: 'number',
        },
        prevPage: {
          type: 'number',
        },
        canGoPrevPage: {
          type: 'boolean',
        },
        canGoNextPage: {
          type: 'boolean',
        },
      },
      required: [
        'items',
        'count',
        'totalCount',
        'totalPages',
        'page',
        'size',
        'nextPage',
        'prevPage',
        'canGoPrevPage',
        'canGoNextPage',
      ],
    },
  },
  required: ['status', 'data'],
};

module.exports = { schema };
