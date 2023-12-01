const {
  schema,
} = require('./schemas/response/saveDataForUserAgentDatasetsRest');
const {
  schema: xRequest,
} = require('./schemas/request/saveDataForUserAgentDatasetsRest');

const openapi = {
  summary: 'Save user agent-specific data for datasets',
  description: `This endpoint allows the storage of user agent-specific data related to various datasets. The aim is to collect and maintain information tailored to the distinct user agents interacting with the system, providing a customized experience for each.

**Authentication:** Users need to be authenticated to store data for user agent datasets. The action will verify the user's identity before proceeding.

**Permissions:** The user must have the appropriate permissions to associate data with user agent datasets. These permissions ensure that only authorized users can perform data storage operations for user agents.

Upon receiving a request, the handler invokes the \`saveDataForUserAgentDatasets\` function, residing in the \`user-agents\` core module. The function takes the relevant data from the request payload and the information about the user's agent from their session. It then processes the data according to predefined dataset schemas, ensuring compatibility and integrity. After successful validation and processing, it stores the data in a persistent storage, typically a database. The results of the operation, such as success confirmation or details of any encountered issues, are then returned to the user in the response.`,
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
