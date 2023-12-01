const { schema } = require('./schemas/response/setKnowHowToUseRest');
const { schema: xRequest } = require('./schemas/request/setKnowHowToUseRest');

const openapi = {
  // summary: "Summary",
  description: `
{
  "summary": "Configure user's knowledge on using REST",
  "description": "This endpoint is responsible for registering or updating the user's proficiency in using REST APIs within the system. It is designed to understand the user's capability and tailor system interactions accordingly.

**Authentication:** User authentication is mandatory for this action. The endpoint requires the user to provide valid credentials before proceeding with the configuration.

**Permissions:** Users need to have administrative privileges or a specific role that grants permission to modify REST API usage settings.

The controller handler initiates the process by determining if the current user session is active and verified. It then checks if the user has adequate permissions to perform the action. With validation complete, the handler invokes a service method, potentially \`setUserRestProficiency\`, passing the user identification and REST proficiency data. This method updates the user's profile with the new settings reflecting their know-how level in REST API utilization. It involves interactions with the data layer to ensure persistence of the changes. Following the update, the handler responds with a success acknowledgment if the operation is successful or an appropriate error message if it fails."
}
`,
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
