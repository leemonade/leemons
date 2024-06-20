// automatic hash: a66a1c63109f95a3fac23368841868261c1669ed3390e6ff5e52980d57bbe83e
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
        en: {
          type: 'object',
          properties: {
            welcome: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  minLength: 1,
                },
                description: {
                  type: 'string',
                  minLength: 1,
                },
                selectLanguage: {
                  type: 'string',
                  minLength: 1,
                },
                disclaimer: {
                  type: 'string',
                  minLength: 1,
                },
                next: {
                  type: 'string',
                  minLength: 1,
                },
                quote: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                      minLength: 1,
                    },
                    description: {
                      type: 'string',
                      minLength: 1,
                    },
                  },
                  required: ['title', 'description'],
                },
              },
              required: [
                'title',
                'description',
                'selectLanguage',
                'disclaimer',
                'next',
                'quote',
              ],
            },
          },
          required: ['welcome'],
        },
      },
      required: ['en'],
    },
  },
  required: ['status', 'data'],
};

module.exports = { schema };
