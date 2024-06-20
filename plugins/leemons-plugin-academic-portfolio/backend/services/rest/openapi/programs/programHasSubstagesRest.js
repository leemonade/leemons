const { schema } = require('./schemas/response/programHasSubstagesRest');
const {
  schema: xRequest,
} = require('./schemas/request/programHasSubstagesRest');

const openapi = {
  summary: 'Determine if a program contains any substages',
  description: `This endpoint checks if a specific academic program contains any substages or not. The primary operation of this endpoint is to ascertain the substage structure within a particular program, which is crucial for managing educational program layouts.

**Authentication:** User authentication is mandatory to access this endpoint. Users must provide valid session credentials to proceed with querying the academic program substages.

**Permissions:** Appropriate permissions are required to access this endpoint. Users should possess the 'view_programs' permission or similar rights that allow them to interact with academic program data.

Upon receiving a request, the handler \`programHasSubstagesRest\` calls the \`getProgramSubstages\` method in the \`programs\` core. This method fetches the program details based on the provided program ID and evaluates whether there are any associated substages. The flow includes validating the user’s credentials and permissions, retrieving the program data from the database, and analyzing the presence of substages. The result, indicating either the existence or absence of substages, is then returned as a Boolean value to the client.`,
  AIGenerated: 'true',
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
