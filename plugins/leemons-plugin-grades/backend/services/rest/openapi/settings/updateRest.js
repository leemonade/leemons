const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update grade settings',
  description: `This endpoint updates the grade settings for a specific academic program or course within the leemons platform. It allows the modification of grading scales, assessment methods, and other relevant settings.

**Authentication:** Users need to be authenticated to update grade settings. Access to the endpoint without proper authentication will be denied.

**Permissions:** The user must possess 'manage_grades' permission to update grade settings. This ensures that only authorized personnel can make changes to critical educational parameters.

Upon receiving a request, the endpoint calls the \`update\` method in the \`settings\` core module. This function retrieves the existing settings based on provided identifiers (like program or course ID), modifies them according to the passed parameters, and stores the new settings back into the database. If the update is successful, it sends a confirmation back to the user. In case of any errors during the process (e.g., missing required fields or unauthorized attempts), appropriate error messages are generated and sent back as responses.`,
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
