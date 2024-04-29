const {
  schema,
} = require('./schemas/response/saveDataForUserAgentDatasetsRest');
const {
  schema: xRequest,
} = require('./schemas/request/saveDataForUserAgentDatasetsRest');

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
