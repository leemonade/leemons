const { schema } = require('./schemas/response/getScormAssignationRest');
const {
  schema: xRequest,
} = require('./schemas/request/getScormAssignationRest');

const openapi = {
  summary: 'Fetch SCORM assignation details for a specific user',
  description: `This endpoint fetches the details of SCORM package assignations for a particular user, including their progress and completion status. It is integral in tracking the learning experience and ensuring compliance with SCORM standards for e-learning content delivery.

**Authentication:** The endpoint requires that the user be authenticated before attempting to retrieve SCORM assignation information. A valid session or token must be provided for the request to be processed.

**Permissions:** Appropriate permissions must be granted for a user to access SCORM assignation details. The user must have the role or permission set that includes rights to view or manage their assigned SCORM content.

Upon receiving a request, 'getScormAssignationRest' internally calls the 'getScormAssignation' function from the core status module. This function is tasked with querying the database for SCORM assignation entries related to the requesting user. It considers the user's identity and permissions to ensure only authorized data is retrieved. Once fetched, the data undergoes any necessary processing, such as formatting and enriching with additional context-specific information. Finally, a detailed response containing the SCORM assignation data is returned to the user in a structured JSON format, indicating progress and completion statuses of the assigned SCORM packages.`,
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
