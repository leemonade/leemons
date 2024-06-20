const { schema } = require('./schemas/response/disableUserAgentRest');
const { schema: xRequest } = require('./schemas/request/disableUserAgentRest');

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
