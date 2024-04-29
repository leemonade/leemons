const { schema } = require('./schemas/response/publishRest');
const { schema: xRequest } = require('./schemas/request/publishRest');

const openapi = {
  summary: 'Publish learning module details',
  description: `This endpoint publishes the details of a specific learning module. It updates the module's status to 'published', making it accessible to users based on the provided access configurations.

**Authentication:** Users must be authenticated to perform this operation. The action checks for a valid session or token before proceeding with the publishing process.

**Permissions:** The user must have 'module_publish' permission to execute this action. Any attempt without this permission will result in an access denied error.

The process begins in the \`publishRest\` action where a specific module's ID is received as a parameter. The action then interacts with \`publishModule\` from the \`modules\` core, which checks if the module exists and verifies the user's permission to publish it. If all validations pass, the module's status in the database is updated to 'published'. This transition allows the module to become visible and accessible to users according to the learning platform's visibility settings. The response from the action confirms the successful publication or returns an error if any part of the process fails.`,
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
