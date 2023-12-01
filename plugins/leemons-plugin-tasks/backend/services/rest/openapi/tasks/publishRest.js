const { schema } = require('./schemas/response/publishRest');
const { schema: xRequest } = require('./schemas/request/publishRest');

const openapi = {
  summary: 'Publish a task for users',
  description: `This endpoint allows for the publication of a task within the platform, making it available for designated users or groups. The process involves updating the task's status to 'published' and ensuring it is visible to those with the appropriate access.

**Authentication:** Users need to be authenticated in order to publish a task. Unauthenticated requests will be rejected and the user will be prompted to log in.

**Permissions:** The user must have the 'publish_task' permission. Without this permission, the action will not be completed and a permission error will be returned.

Upon receiving a request to publish a task, the handler calls the \`publish\` method from the task's core module. This method verifies the task ID and current user's permissions before proceeding. If the validation is successful, the task's status is updated to 'published' in the database. The method ensures that all associated notifications or triggers are properly configured to alert relevant users or systems. Once completed, the method returns a confirmation message along with any relevant task details, which are then conveyed back to the requester through the REST API response.`,
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
