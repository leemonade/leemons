const { schema } = require('./schemas/response/removeConfigEventRest');
const { schema: xRequest } = require('./schemas/request/removeConfigEventRest');

const openapi = {
  summary: 'Remove a specific event from a calendar configuration',
  description: `This endpoint allows for the removal of a specific event from an existing calendar configuration. The removal operation will delete the event from the calendar, preventing it from being displayed or accessed in the future.

**Authentication:** User authentication is required to ensure that only authorized personnel can remove events from the calendar configuration.

**Permissions:** Appropriate permissions are necessary to perform event removal operations. Users must have event management rights within the calendar plugin's scope.

Upon receiving the request, the handler initiates the \`removeConfigEvent\` action, passing along the event's identifying details within the request's payload. The method involved with this action verifies the user's authorization, the existence of the event, and the user's permissions to manage the event within the specified calendar configuration. If validation passes, the method proceeds to remove the event from the database. The endpoint essentially orchestrates the necessary validations and interactions with underlying core functionalities to achieve the removal of the event smoothly and securely.`,
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
