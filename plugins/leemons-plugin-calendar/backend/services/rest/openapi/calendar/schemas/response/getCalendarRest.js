// automatic hash: 7ea123724a0e7cb257107bc781c212824317a4b402148aa41ecb441b8561a260
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    userCalendar: {
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
        key: {
          type: 'string',
          minLength: 1,
        },
        name: {
          type: 'string',
          minLength: 1,
        },
        bgColor: {
          type: 'string',
          minLength: 1,
        },
        borderColor: {
          type: 'string',
          minLength: 1,
        },
        section: {
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
      },
      required: [
        '_id',
        'id',
        'deploymentID',
        'key',
        'name',
        'bgColor',
        'borderColor',
        'section',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
      ],
    },
    ownerCalendars: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'key',
          'name',
          'bgColor',
          'borderColor',
          'section',
          'isDeleted',
          '__v',
          'isClass',
          'isUserCalendar',
          'image',
          'fullName',
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
          name: {
            type: 'string',
            minLength: 1,
          },
          bgColor: {
            type: 'string',
            minLength: 1,
          },
          borderColor: {
            type: 'string',
            minLength: 1,
          },
          section: {
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
          isClass: {
            type: 'boolean',
          },
          isUserCalendar: {
            type: 'boolean',
          },
          image: {
            type: 'string',
            minLength: 1,
          },
          metadata: {},
          fullName: {
            type: 'string',
            minLength: 1,
          },
        },
      },
    },
    configCalendars: {},
    calendars: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: [
          'id',
          'deploymentID',
          'key',
          'name',
          'bgColor',
          'borderColor',
          'section',
          'isDeleted',
          '__v',
          'isClass',
          'isUserCalendar',
          'image',
          'fullName',
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
          name: {
            type: 'string',
            minLength: 1,
          },
          bgColor: {
            type: 'string',
            minLength: 1,
          },
          borderColor: {
            type: 'string',
            minLength: 1,
          },
          section: {
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
          isClass: {
            type: 'boolean',
          },
          isUserCalendar: {
            type: 'boolean',
          },
          image: {
            type: 'string',
            minLength: 1,
          },
          metadata: {},
          fullName: {
            type: 'string',
            minLength: 1,
          },
        },
      },
    },
    events: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  required: ['status', 'userCalendar', 'ownerCalendars', 'calendars', 'events'],
};

module.exports = { schema };
