const { schema } = require('./schemas/response/addManualDeploymentRest');
const {
  schema: xRequest,
} = require('./schemas/request/addManualDeploymentRest');

const openapi = {
  summary: 'Initiate a new manual deployment process',
  description: `This endpoint facilitates the initiation of a new manual deployment in the leemons platform. It primarily serves as the starting point for deploying new configurations or services manually by the user.

**Authentication:** Users must be authenticated to initiate a deployment process. Unauthorized access will be blocked and the system will only process requests from valid, logged-in users.

**Permissions:** The user must have specific roles or permissions, typically like 'deployment-manager' or 'admin', allowing them to perform deployment-related actions within the system.

The process starts with the endpoint receiving a deployment configuration request. This request triggers the \`addDeployment\` method in the deployment manager's core logic. The method involves validating the provided deployment data against predefined schemas and ensuring all necessary components for the deployment are accounted for and correctly configured. Following the validation, the deployment data is saved to the system's database. Successful execution results in a response indicating the deployment has been initiated, along with details of the deployment record.`,
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
