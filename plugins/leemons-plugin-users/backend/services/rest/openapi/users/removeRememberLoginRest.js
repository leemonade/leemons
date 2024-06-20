const { schema } = require('./schemas/response/removeRememberLoginRest');
const {
  schema: xRequest,
} = require('./schemas/request/removeRememberLoginRest');

const openapi = {
  // summary: "Summary",
  // description: "Description",

  'x-request': xRequest,
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema,
        },
      },
    },
  },
};

module.exports = {
  openapi,
};
