// automatic hash: d66edaa9831ebea8896b424e708d37c7b5af9dcb2dea6eece041b8f365649dd2
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    theme: {
      type: 'object',
      properties: {
        logoUrl: {},
        squareLogoUrl: {},
        mainColor: {
          type: 'string',
          minLength: 1,
        },
        useDarkMode: {
          type: 'boolean',
        },
        menuMainColor: {
          type: 'string',
          minLength: 1,
        },
        menuDrawerColor: {
          type: 'string',
          minLength: 1,
        },
        usePicturesEmptyStates: {
          type: 'boolean',
        },
      },
      required: [
        'mainColor',
        'useDarkMode',
        'menuMainColor',
        'menuDrawerColor',
        'usePicturesEmptyStates',
      ],
    },
  },
  required: ['status', 'theme'],
};

module.exports = { schema };
