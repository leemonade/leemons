const { schema } = require('./schemas/response/saveRest');
const { schema: xRequest } = require('./schemas/request/saveRest');

const openapi = {
  summary: 'Save regional academic calendar configurations',
  description: `This endpoint allows for the creation or update of regional academic calendar configurations. It is utilized to adapt the academic calendar settings according to specific regional requirements, ensuring that the calendar reflects local holidays, events, and scheduling conventions.

**Authentication:** A user must be authenticated to use this endpoint. Proper credentials need to be provided for the action to be authorized.

**Permissions:** The user needs to have the 'manage_academic_calendar' permission to modify regional configuration settings. Users without this permission will not be authorized to make changes.

Upon receiving a request to save regional config, the handler calls the \`saveRegionalConfig\` method defined in 'regional-config/index.js'. This method includes validation of the provided data against the schema specified in 'forms.js'. If the data is valid, the configuration is persisted to the database utilizing functions from 'saveRegionalConfig.js'. The result of the operation, which could be either the newly created or updated configuration, is then returned to the user as a JSON object accompanied by appropriate HTTP status codes indicating success or failure of the operation.`,
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
