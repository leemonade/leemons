const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Manage multilingual locale settings',
  description: `This endpoint is responsible for managing locale settings within a multilingual plugin environment. It handles the creation, reading, updating, and deletion of locale configurations, which are essential for supporting multiple languages across the plugin's functionalities.

**Authentication:** Users need to be authenticated to interact with the locale settings. Depending on the platform configuration, this might require session tokens or other forms of identity verification to proceed.

**Permissions:** Proper permissions are required to access or modify the locale settings. Typically, users need administrative privileges or must be part of a specific group that has rights to manage language settings and configurations.

The controller handles requests by determining the needed action (create, read, update, delete) based on the API endpoint accessed and the request method. It utilizes specific methods from the 'locale' core module like \`create\`, \`read\`, \`update\`, and \`delete\`, each tailored to operate with language and regional settings in a database. The input validation is ensured by the 'locale.js' validations file, which checks correctness before processing any data. The endpoint flows involve error handling to manage and respond to any issues during operations, ensuring that feedback regarding the execution is clear and concise. When successful, the endpoint returns a JSON object representing the status and any data relevant to the performed action.`,
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
