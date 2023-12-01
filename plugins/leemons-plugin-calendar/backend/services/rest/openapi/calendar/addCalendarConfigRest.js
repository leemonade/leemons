const { schema } = require('./schemas/response/addCalendarConfigRest');
const { schema: xRequest } = require('./schemas/request/addCalendarConfigRest');

const openapi = {
  summary: 'Add a new calendar configuration',
  description: `This endpoint is responsible for creating a new calendar configuration within the system. A calendar configuration may include settings like the name of the calendar, its associated events, and any specific rules or metadata related to its operation.

**Authentication:** Users must be authenticated to create a new calendar configuration. Unauthorized attempts will be rejected.

**Permissions:** Users need to have administrative privileges to add calendar configurations. Failure to meet this criterion will result in denied access to this endpoint.

Upon receiving a request to add a new calendar configuration, the handler first authenticates the user and verifies if they have the necessary administrative permissions. If the user passes the authentication and permission checks, the handler calls the \`addCalendarConfig\` method from the \`CalendarConfigs\` core. This method handles the insertion of the new configuration into the data store and ensures that the data adheres to the predefined schema. Any validation errors or issues during this process are communicated back to the client. Once successfully added, the endpoint responds with details of the newly created calendar configuration.`,
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
