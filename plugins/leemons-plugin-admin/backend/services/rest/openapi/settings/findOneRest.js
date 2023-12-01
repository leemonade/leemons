const { schema } = require('./schemas/response/findOneRest');
const { schema: xRequest } = require('./schemas/request/findOneRest');

const openapi = {
  summary: 'Finds a specific settings record',
  description: `This endpoint retrieves a specific settings record by the given identifier. It is typically used for administrative purposes to view or modify configuration settings within the system.

**Authentication:** Users need to be authenticated and have a valid session. Only requests with proper credentials will proceed, otherwise access will be denied.

**Permissions:** This endpoint requires administrative privileges. Users must possess the necessary role or permission set to view or manage system settings.

The handler for the \`findOneRest\` property is designed to facilitate the retrieval of a particular settings record. When a request is made to this endpoint, the handler invokes the \`findOne\` method in the \`settings\` core. This method is responsible for querying the database to find the settings record that matches the given identifier. It uses predefined schema validations and query optimizations to ensure efficient data retrieval. Upon finding the record, the information is returned in a well-structured JSON format as part of the HTTP response. If the specified settings record does not exist or an error occurs during the operation, an appropriate error message is generated and sent back to the client.`,
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
