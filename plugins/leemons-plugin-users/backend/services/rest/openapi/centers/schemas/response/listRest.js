// automatic hash: 0e6f4a2c15295eab88974eb8aad414288a05834e88060d8edc629ebbd000695c
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
              'locale',
              'uri',
              'timezone',
              'firstDayOfWeek',
              'country',
              'city',
              'postalCode',
              'street',
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
              name: {
                type: 'string',
                minLength: 1,
              },
              locale: {
                type: 'string',
                minLength: 1,
              },
              uri: {
                type: 'string',
                minLength: 1,
              },
              timezone: {
                type: 'string',
                minLength: 1,
              },
              firstDayOfWeek: {
                type: 'number',
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
              limits: {
                type: 'array',
                uniqueItems: true,
                minItems: 1,
                items: {
                  required: [
                    'center',
                    'deploymentID',
                    'isDeleted',
                    'item',
                    '__v',
                    'id',
                    'limit',
                    'type',
                  ],
                  properties: {
                    _id: {
                      type: 'object',
                      properties: {
                        valueOf: {},
                      },
                      required: ['valueOf'],
                    },
                    center: {
                      type: 'string',
                      minLength: 1,
                    },
                    deploymentID: {
                      type: 'string',
                      minLength: 1,
                    },
                    isDeleted: {
                      type: 'boolean',
                    },
                    item: {
                      type: 'string',
                      minLength: 1,
                    },
                    __v: {
                      type: 'number',
                    },
                    createdAt: {
                      type: 'object',
                      properties: {},
                      required: [],
                    },
                    deletedAt: {},
                    id: {
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
                    updatedAt: {
                      type: 'object',
                      properties: {},
                      required: [],
                    },
                    unlimited: {},
                  },
                },
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
