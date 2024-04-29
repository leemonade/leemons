const { schema } = require('./schemas/response/getGeneralConfigRest');
const { schema: xRequest } = require('./schemas/request/getGeneralConfigRest');

const openapi = {
  summary: 'Retrieve general configuration settings for the platform',
  description: `This endpoint fetches the general configuration settings of the Leemons platform engine. This includes settings that define behaviors and properties that affect various functionalities across the entire platform.

**Authentication:** This endpoint requires the user to be authenticated before accessing the general configurations. An unauthorized access attempt will result in a rejection of the request.

**Permissions:** Adequate permissions are necessary to retrieve these settings. Typically, only administrators or users with high-level privileges have the ability to access general configuration details.

The process begins with the endpoint invoking the \`getGeneral\` method located within the \`config\` core of the leemons-plugin-comunica. This method is responsible for gathering all relevant configuration settings from a centralized configuration store. The information retrieved includes key-value pairs that represent the most crucial operational parameters for the platform. The configuration details are then formatted and returned as a JSON object, providing the client with a comprehensive view of the platform's operational baseline settings.`,
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
