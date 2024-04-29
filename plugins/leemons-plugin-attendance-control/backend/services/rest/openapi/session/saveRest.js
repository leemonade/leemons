const { schema } = require('./schemas/response/saveRest');
const { schema: xRequest } = require('./schemas/request/saveRest');

const openapi = {
  summary: 'Saves session data for a user',
  description: `This endpoint is responsible for capturing and storing attendance-related session data for a specific user within the leemons platform. It primarily manages the session details and updates or creates attendance records based on the input data.

**Authentication:** Users need to be authenticated to save session data. An absence of valid authentication will prevent access to this functionality.

**Permissions:** The endpoint requires 'attendance-management' permission. Without this, users will not be able to save or modify session data.

The flow starts with the endpoint parsing the incoming request to extract session data details. It then calls the \`saveSession\` method from the \`session\` core, which handles the logic for checking existing records and updating them or creating new entries if no existing record matches. This involves critical checks on data validation and integrity to ensure that only valid and complete data is processed. Errors in processing or validation will result in specific error messages being returned. On successful completion, a confirmation is sent back to the user indicating that the data has been successfully saved.`,
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
