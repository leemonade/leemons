const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Updates a specific assignable instance',
  description: `This endpoint allows for the modification of an existing assignable instance based on the provided data. It updates the instance's details, configurations, and relationships in the system. The action typically involves altering attributes such as titles, descriptions, or associated metadata.

**Authentication:** To access this endpoint, the user must be authenticated. Any request without a valid authentication token will be rejected.

**Permissions:** This endpoint requires the user to have appropriate permissions to modify the specified instance. Without the necessary permissions, the user's request to update the instance will be denied.

The handler delegates the task by calling the \`updateInstance\` method from the \`Instances\` core. The request payload is first validated to ensure all necessary data is present and conforms to the expected schema. Next, the method checks if the user has required permissions using \`getUserPermission\` or \`getTeacherPermission\` depending on the user's role. If authorized, it continues to update the instance details by invoking \`updateInstance.js\` within the core, which interacts with the database to persist changes. It may involve additional helper functions from the \`validators\` folder and updating relationships, such as subjects and dates, through the respective core functions. Upon successful update, it returns a confirmation response, and in the case of failures or errors, appropriate error messages are sent back to the user.`,
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
