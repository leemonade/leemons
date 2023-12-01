const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update academic portfolio settings',
  description: `This endpoint updates the academic portfolio settings with the provided values. It is responsible for writing new configuration data to the academic portfolio module within the Leemons platform, ensuring that the settings are kept consistent and current according to user or administrative input.

**Authentication:** User authentication is required to ensure that only authorized individuals can make changes to the academic portfolio settings. Unauthorized access attempts will be rejected.

**Permissions:** Users must have the appropriate level of permissions to update the academic portfolio settings. These permissions ensure that only users with administrative privileges or those granted specific roles can alter the settings.

Upon receiving a request, the endpoint first checks for user authentication and permissions. If these checks pass, it then calls the \`update\` method from the \`Settings\` core. This method processes the incoming data and updates the settings in the database. The flow involves validation of the input data, execution of the update logic, and a confirmation response indicating whether the operation succeeded. Finally, the updated settings are returned in the response payload, giving immediate feedback to the client about the new state of the configuration.`,
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
