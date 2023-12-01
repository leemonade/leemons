const { schema } = require('./schemas/response/listGroupRest');
const { schema: xRequest } = require('./schemas/request/listGroupRest');

const openapi = {
  summary: 'List all groups',
  description: `This endpoint lists all the academic groups available in the system. It may return a wide range of groups depending on the underlying conditions such as academic period, program affiliations, and other context-dependent factors.

**Authentication:** Users must be logged in to retrieve the list of groups. A valid session is required to ensure that the user has the necessary privileges to access group information.

**Permissions:** This endpoint requires specific permissions to access the group data. The exact permission requirements will depend on the role of the user and the privacy settings of the groups within the academic portfolio.

Upon receiving a request, the controller initiates the \`listGroups\` action by calling the \`listGroups\` method. This method fetches the relevant group data from the underlying storage system, applying any necessary filters based on user permissions and other contextual information. The collected data is then processed and organized to fit the expected output structure. Finally, the processed group data is returned to the client as a structured JSON response, which includes information such as group identifiers, names, and associations relevant to the academic portfolio of the user.`,
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
