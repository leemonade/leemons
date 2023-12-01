const { schema } = require('./schemas/response/detailRest');
const { schema: xRequest } = require('./schemas/request/detailRest');

const openapi = {
  summary: 'View family member details',
  description: `This endpoint allows for the retrieval of details for a specific family member within the system. The data returned can include personal information, relationship details, and any relevant family information associated with that member.

**Authentication:** Users need to be authenticated to access the details of family members. Access is restricted and an authentication check is performed before the data can be retrieved.

**Permissions:** Specific permissions related to family data access are required to use this endpoint. Only users with the appropriate permission will be granted access to the family member information.

Upon the initial request, this endpoint begins by executing the \`detailRest\` action. This action involves several methods such as \`canViewFamily\` to check if the user has the necessary rights to view the family, \`isFamilyMember\` to verify if the user requesting the information is a part of the family, and \`getMembers\` to gather the family member details. Finally, \`getSessionFamilyPermissions\` is used to ensure that the session has the appropriate permissions to view the data. Throughout the flow, various checks are in place to ensure that the user is authorized and has the right permissions to access the family member details. The outcome is either the detailed data of the specified family member packaged in a JSON object or a failure response indicating the reason for denial of access.`,
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
