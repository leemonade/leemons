const { schema } = require('./schemas/response/pinsRest');
const { schema: xRequest } = require('./schemas/request/pinsRest');

const openapi = {
  summary: 'Manages pin-related functionalities for assets',
  description: `This endpoint is responsible for handling various operations related to pins, including adding, removing, updating, and retrieving pin information related to assets in the Leebrary system.

**Authentication:** Users must be logged in to interact with pin functionalities. Access is denied if authentication credentials are absent or invalid.

**Permissions:** User permissions need to align with actions like creating, updating, or deleting pins. Specific permission validation is performed based on the user role and the nature of the operation requested.

Upon receiving a request, this controller first verifies the user's authentication and permissions. Depending on the operation - add, remove, update, or fetch - it delegates the task to respective methods within the \`PinsService\`. Each method utilizes the Moleculer service actions to interact with the database and manipulate or retrieve pin data associated with assets. The flow typically involves validating the input parameters, executing the logic required for each type of pin operation, and formatting the output to be suitable for client's consumption, finalizing with an HTTP response conveying the result or status of the operation.`,
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
