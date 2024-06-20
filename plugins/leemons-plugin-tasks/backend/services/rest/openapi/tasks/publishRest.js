const { schema } = require('./schemas/response/publishRest');
const { schema: xRequest } = require('./schemas/request/publishRest');

const openapi = {
  summary: 'Publish a new task within the platform',
  description: `This endpoint handles the publication of a new task in the leemons platform. It involves creating task entries in the backend data store and setting up necessary configurations to track and manage these tasks as part of the broader application environment.

**Authentication:** Users need to be authenticated to utilize this endpoint. The absence of a valid authentication mechanism or session will prevent the user from performing any operations associated with task publication.

**Permissions:** Proper permissions are required to publish tasks. Users attempting to access this endpoint must possess task creation or management rights as dictated by the leemons platform's security policies.

Following authentication and permission checks, the \`publishRest\` action invokes the core method \`publishTask\` from the \`tasks\` module, which performs the task data validation, creation, and initial setup. This method ensures that all task data complies with the predefined schemas and handles state tracking from creation to publication. The result of this method is a new task instance that is recorded in the database and configured for tracking and management within the leemons ecosystem. The response back to the client indicates successful task creation and includes details of the newly created task.`,
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
