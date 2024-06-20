const { schema } = require('./schemas/response/findOneRest');
const { schema: xRequest } = require('./schemas/request/findOneRest');

const openapi = {
  summary: 'Retrieve a single setting by key',
  description: `This endpoint retrieves a specific setting based on the provided key. It fetches the setting details from the settings database, including configurations or values specified for that particular key.

**Authentication:** User authentication is required to access this endpoint. The request must include a valid user token to verify the identity of the requester.

**Permissions:** The user needs to have 'read_settings' permission to fetch the details of the specified setting. Access without the appropriate permission will be denied.

Upon receiving a request, the \`findOne\` method in the \`Settings\` core is triggered, starting with validation of the supplied token and permissions. If validation passes, the method queries the settings database using the provided key to retrieve the corresponding setting. The result of this query is then formatted and returned as a JSON object in the response, providing the client with the requested setting details.`,
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
