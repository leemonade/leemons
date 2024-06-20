const { schema } = require('./schemas/response/deleteRest');
const { schema: xRequest } = require('./schemas/request/deleteRest');

const openapi = {
  summary: 'Delete a specific regional configuration',
  description: `This endpoint handles the deletion of a specific regional configuration in the academic calendar system. By targeting a unique identifier, it allows for precise removal of regional configurations which are no longer needed or valid within the system.

**Authentication:** Users need to be authenticated to perform deletion operations. Proper authentication ensures that only authorized users can delete configurations, preventing unauthorized changes.

**Permissions:** Users must have administrative permissions specifically for managing regional configurations. These permissions ensure that only users with the correct access rights can carry out deletions, maintaining system integrity.

The process begins with the controller action, which invokes the \`deleteRegionalConfig\` method from the \`regional-config\` core. This method utilizes the passed identifier to locate and verify the existence of the configuration in the database. If found, it proceeds to delete the configuration. Upon successful deletion, a confirmation is sent back to the user, otherwise, an error message is generated indicating the failure of the operation. Each step carefully checks and logs the progress to ensure accuracy and traceability.`,
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
