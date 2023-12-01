// automatic hash: b4c11ce517d4daddbae698837d559c07e3334e070642bec5269567c3a26c9b4c
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    instance: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          minLength: 1,
        },
        students: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        dates: {
          type: 'object',
          properties: {
            visualization: {
              type: 'string',
              minLength: 1,
            },
          },
          required: ['visualization'],
        },
        classes: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        metadata: {
          type: 'object',
          properties: {
            evaluationType: {
              type: 'string',
              minLength: 1,
            },
          },
          required: ['evaluationType'],
        },
        curriculum: {
          type: 'object',
          properties: {
            custom: {
              type: 'boolean',
            },
          },
          required: ['custom'],
        },
        relatedAssignableInstances: {},
      },
      required: [
        'id',
        'students',
        'dates',
        'classes',
        'metadata',
        'curriculum',
      ],
    },
  },
  required: ['status', 'instance'],
};

module.exports = { schema };
