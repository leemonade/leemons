const { schema } = require('./schemas/response/getCenterConfigRest');
const { schema: xRequest } = require('./schemas/request/getCenterConfigRest');

const openapi = {
  summary: 'Retrieve configuration details of a center',
  description: `This endpoint fetches and returns the detailed configuration settings of a specific center within the Leemons platform. Typical settings can include general information, active modules, and specific policies applied to the center.

**Authentication:** Users need to be authenticated to access the configuration details of a center. The endpoint will reject requests without valid authentication credentials.

**Permissions:** Access to this endpoint requires the 'view_center_config' permission, ensuring that only users with the necessary rights can view center configuration details.

The handler initiates by calling the \`getConfig\` method in the \`config.rest.js\` service file, which further invokes the \`getCenter\` function from the \`getCenter.js\` in the core config directory. This function is responsible for retrieving the center-specific settings from the database based on the center ID provided in the request. It consolidates configuration details, applies any necessary transformations or filters, and finally, returns these details to the requester in a structured JSON format. Comprehensive error handling is implemented to manage cases where the center ID is invalid or the user does not hold the required permissions.`,
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
