const { schema } = require('./schemas/response/deleteAssignConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/deleteAssignConfigRest');

const openapi = {
  summary: 'Deletes assigned configuration data',
  description: `This endpoint handles the removal of specific configuration data assigned to a user or a certain system function within the platform. It specifically looks for configurations that have been previously saved and are no longer required or valid, ensuring the system's data integrity and customization relevance are maintained.

**Authentication:** Users need to be authenticated to perform deletion operations on configurations. Failure to provide valid authentication credentials will prevent access to this functionality.

**Permissions:** The endpoint requires administrative rights or specific role-based permissions, designed to ensure that only authorized personnel can delete sensitive configuration data.

Upon receiving a delete request, the \`deleteAssignConfigRest\` action within the \`tests.rest.js\` file initiates the process by verifying user credentials and permissions. It then calls the \`deleteAssignSavedConfig\` method from the backend's core logic, passing necessary parameters such as configuration identifiers. This method interacts with the backend database or configuration storage to effectively remove the designated entries. The process is logged for auditing purposes, and upon successful completion, a confirmation response is sent back to the user indicating the successful deletion of the configuration data.`,
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
