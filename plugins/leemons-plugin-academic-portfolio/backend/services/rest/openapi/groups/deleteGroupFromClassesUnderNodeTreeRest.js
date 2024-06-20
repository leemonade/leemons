const {
  schema,
} = require('./schemas/response/deleteGroupFromClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/deleteGroupFromClassesUnderNodeTreeRest');

const openapi = {
  summary: 'Remove a group from classes under a specific node tree',
  description: `This endpoint allows the removal of a specified group from all classes that fall under a given node tree in the academic portfolio system. It ensures that the group is disassociated from the appropriate classes to maintain up-to-date records.

**Authentication:** Users must be authenticated to perform this removal operation. The server validates the user's credentials and session to confirm legitimacy before processing the request.

**Permissions:** This operation requires the user to have administrative or specific management permissions related to academic portfolios. Without sufficient permissions, the request will be rejected.

The endpoint initiates by calling the \`removeGroupFromClassesUnderNodeTree\` method, which utilizes predefined logic in the academic portfolio's backend to identify all classes linked to a certain node tree. The method processes this identification in multiple steps including fetching relevant class details and subsequently removing the specified group from these classes. The action is handled through a series of database operations that ensure data integrity and consistency. On successful execution, the endpoint updates the system to reflect these changes, typically confirming the successful removal with a status response.`,
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
