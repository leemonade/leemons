const { schema } = require('./schemas/response/publishRest');
const { schema: xRequest } = require('./schemas/request/publishRest');

const openapi = {
  summary: 'Publish a specific learning module',
  description: `This endpoint is responsible for publishing a learning module so that it becomes available to users who have the required permissions to access it. The publishing process involves updating the module's status and ensuring all content within the module is finalized and ready for learners.

**Authentication:** Users must be authenticated to publish a learning module. The process is secured and checks authentication tokens to verify the legitimacy of the request.

**Permissions:** This endpoint requires specific permissions related to content management or module administration. The user must have the authority to modify the status of learning modules and make them publicly accessible within the platform.

Upon receiving a request, the \`publishRest\` action handler in the \`modules.rest.js\` service file delegates the task to the \`publishModule\` function within the \`core/modules/index.js\` module. This function then calls the \`publishModule\` method from the \`core/modules/publishModule.js\` file, which performs the publication logic. The publication process includes checks on the module's readiness, updating its state in the system's database, and handling any necessary notifications or triggers associated with this event. Finally, the outcome of the publishing action is returned to the user, along with appropriate HTTP status codes and messages indicating the success or failure of the publication request.`,
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
