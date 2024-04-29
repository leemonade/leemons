// automatic hash: 55378408c581d028b4a0b3a1885fe5ff7432d623876051efd05c4e0d557e4732
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    organization: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 1,
        },
        hostname: {
          type: 'string',
          minLength: 1,
        },
        hostnameApi: {
          type: 'string',
          minLength: 1,
        },
        logoUrl: {},
        squareLogoUrl: {},
        emailLogoUrl: {},
        emailWidthLogo: {},
        mainColor: {
          type: 'string',
          minLength: 1,
        },
        email: {
          type: 'string',
          minLength: 1,
        },
        contactPhone: {
          type: 'string',
          minLength: 1,
        },
        contactEmail: {
          type: 'string',
          minLength: 1,
        },
        contactName: {
          type: 'string',
          minLength: 1,
        },
        useDarkMode: {
          type: 'boolean',
        },
        usePicturesEmptyStates: {
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
      },
      required: [
        'name',
        'hostname',
        'hostnameApi',
        'mainColor',
        'email',
        'contactPhone',
        'contactEmail',
        'contactName',
        'useDarkMode',
        'usePicturesEmptyStates',
        'menuMainColor',
        'menuDrawerColor',
      ],
    },
  },
  required: ['status', 'organization'],
};

module.exports = { schema };
