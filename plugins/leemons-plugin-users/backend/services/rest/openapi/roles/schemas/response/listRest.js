// automatic hash: 44d5bbd36866a7c445ad9916c5fe0f94b4f2b9442e436c043f1f278209200251
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
          items: {
            required: [],
            properties: {},
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
