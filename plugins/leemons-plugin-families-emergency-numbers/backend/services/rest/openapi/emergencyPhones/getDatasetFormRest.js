const { schema } = require('./schemas/response/getDatasetFormRest');
const { schema: xRequest } = require('./schemas/request/getDatasetFormRest');

const openapi = {
  summary: 'Fetch emergency contact numbers for families',
  description: `This endpoint provides a concise list of emergency phone numbers tailored for family use. It ensures that users can quickly access critical contact information in case of an emergency without navigating through multiple pages or systems.

**Authentication:** User must be authenticated to retrieve emergency contact numbers. Access to this endpoint is denied if the user does not provide a valid authentication token.

**Permissions:** This endpoint requires users to have the 'view_emergency_numbers' permission to access the list of emergency numbers. Users without this permission will receive an authorization error message.

Upon receiving a request, the endpoint initially checks for user authentication and appropriate permissions. Once validated, it calls the \`getFamilyEmergencyContacts\` method from the \`EmergencyService\`. This method retrieves all relevant emergency contact numbers stored in the system database that are marked as important for families. The retrieved data is then formatted into a JSON response and sent back to the user, providing a streamlined and accessible list of emergency contacts for immediate reference.`,
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
