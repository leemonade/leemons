const { schema } = require('./schemas/response/listDetailPageRest');
const { schema: xRequest } = require('./schemas/request/listDetailPageRest');

const openapi = {
  summary: 'Displays detailed list of family members associated with the user',
  description: `This endpoint delivers a detailed list and relationships of all family members associated with the authenticated user. This list might include sensitive information such as member roles, relationship status, and personal identifiers.

**Authentication:** Users need to be authenticated to fetch their family details. The endpoint verifies the user's credentials and session validity before proceeding.

**Permissions:** Users must have the 'view_family_details' permission enabled in their profile. Without this permission, the endpoint restricts access and returns an unauthorized access error.

Upon receiving the request, the endpoint first retrieves the user's identity and associated family IDs through the \`getUserFamilyIds\` method. It then uses the \`listDetailPage\` function to fetch a comprehensive list of all family members, along with pertinent details like age, relationship, and roles within the family structure. This process may involve several layers of data processing, including security checks for data sensitivity and user permissions. Finally, data is formatted appropriately and sent back to the user as a detailed, structured JSON response.`,
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
