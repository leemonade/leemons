const { schema } = require('./schemas/response/findOneRest');
const { schema: xRequest } = require('./schemas/request/findOneRest');

const openapi = {
  summary: 'Retrieves specific task settings based on query criteria',
  description: `This endpoint is designed to fetch specific settings for tasks within the system based on provided query criteria. It primarily handles the retrieval of settings that match certain specified conditions, enabling dynamic configuration based on task requirements.

**Authentication:** Users need to authenticate to access the settings for tasks. Proper authentication ensures that settings are served only to users with valid access rights.

**Permissions:** The user must possess adequate permissions to view or manage task settings. This typically includes roles such as administrator or task manager, where viewing sensitive configuration details is permitted.

The handler starts by calling the \`findOne\` method from the \`settings\` core. This method takes request parameters that define the criteria for what settings to retrieve. It executes a query against the database to locate the settings entry that matches the criteria. Once the appropriate settings are found, the method returns these settings to the handler. The handler then formats this data into a response body, converting the settings data into a structured JSON object, which is then sent back to the client. This process allows clients to receive precise configuration details based on their query parameters.`,
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
