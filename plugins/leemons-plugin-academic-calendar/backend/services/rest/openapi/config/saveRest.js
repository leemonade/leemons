const { schema } = require('./schemas/response/saveRest');
const { schema: xRequest } = require('./schemas/request/saveRest');

const openapi = {
  summary: 'Save academic calendar configuration settings',
  description: `This endpoint allows the client to save configuration settings for the academic calendar. These configuration settings might include various preferences and rules related to the academic year structure, such as term durations, holiday periods, and other relevant parameters.

**Authentication:** Users need to be authenticated to modify the academic calendar settings. Unauthenticated users will not have access to this functionality.

**Permissions:** Adequate permissions are required to update the academic calendar configuration. Typically, this would be limited to administrative roles who have the authority to define and adjust academic periods.

Upon receiving a request, the \`saveConfig\` handler is initiated, which is responsible for processing the configuration data submitted by the client. The handler validates the incoming data against the predefined schema to ensure all required fields are correctly formatted and contain valid information. After validation, it delegates the task to the \`saveConfig\` method located within the \`config\` core of the academic calendar plugin. This method then interacts with the underlying persistence layer to update the configuration settings in the datastore. If the operation is successful, the endpoint responds with a confirmation message indicating that the configuration has been updated. In the case of an error, a corresponding error message is returned instead.`,
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
