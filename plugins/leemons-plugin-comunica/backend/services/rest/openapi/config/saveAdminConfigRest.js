const { schema } = require('./schemas/response/saveAdminConfigRest');
const { schema: xRequest } = require('./schemas/request/saveAdminConfigRest');

const openapi = {
  summary: 'Save admin configurations for the comunication platform',
  description: `This endpoint facilitates the saving of comprehensive administrative configurations for the communication platform. It is tasked with handling updates and storage of setups related to general, program, center, and various specific configurations under administrative privileges.

**Authentication:** User authentication is mandatory for access to this endpoint. Presence of a valid authorization token is required to ensure the user is authenticated before proceeding with any operations.

**Permissions:** Adequate administrative privileges are required to interact with this endpoint. The user must possess rights to modify system-wide settings that impact various aspects of the communication platform.

Upon receiving a request, the \`saveAdminConfigRest\` endpoint initially validates the provided input data against predefined schemas to ensure compliance with the expected format and data types. It leverages various internal methods such as \`saveGeneral\`, \`saveCenter\`, \`saveProgram\`, and \`saveFullByCenter\` from the \`config\` core, each responsible for updating specific segments of the system configurations. These methods operate by altering settings in the database, ensuring that changes are both preserved and correctly implemented according to the administrative standards. The culmination of this process results in a response signaling the successful update of the configurations, accompanied by the new settings state.`,
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
