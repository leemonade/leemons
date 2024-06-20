// automatic hash: 6caf433b7a6826c0b6f09cb57e97bbcca7c8b9b08c373942251c4188e4d33618
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    mainColor: {
      type: 'string',
      minLength: 1,
    },
    email: {
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
    name: {
      type: 'string',
      minLength: 1,
    },
    contactName: {
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
    subdomain: {
      type: 'string',
      minLength: 1,
    },
    squareLogoUrl: {},
    logoUrl: {},
    hostname: {
      type: 'string',
      minLength: 1,
    },
    hostnameApi: {
      type: 'string',
      minLength: 1,
    },
  },
  required: [
    'mainColor',
    'email',
    'useDarkMode',
    'usePicturesEmptyStates',
    'menuMainColor',
    'menuDrawerColor',
    'name',
    'contactName',
    'contactPhone',
    'contactEmail',
    'subdomain',
    'hostname',
    'hostnameApi',
  ],
};

module.exports = { schema };
