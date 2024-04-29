const { schema } = require('./schemas/response/searchRest');
const { schema: xRequest } = require('./schemas/request/searchRest');

const openapi = {
  summary: 'Search assignable instances based on specified criteria',
  description: `This endpoint handles the search operation for different instances of assignables based on the presented criteria, filters, and sort options supplied as part of the request. This could cover a wide range of assignable types, like homework, projects, or quizzes, facilitating the retrieval of relevant assignables according to user needs.

**Authentication:** Users need to be authenticated in order to perform a search on assignable instances. The user’s credentials must be verified to ensure valid access to the requested data.

**Permissions:** Specific permissions are required to access this endpoint, ensuring that only users with rights to view or manage assignables can execute searches on instances.

The flow of the controller starts by validating user authentication and permissions. Upon validation, it processes the incoming query including filters like date, status, or type of assignable. The method \`filterInstancesByRoleAndQuery\` from the helpers filters the instances according to the role of the user and the query parameters. Afterwards, \`getInstanceDates\` and \`filterByInstanceDates\` methods are applied to narrow down the search results relating to specific date ranges. Finally, the search results are sorted by date via the \`sortInstancesByDates\` method before sending the response back to the user containing the filtered and sorted list of assignable instances.`,
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
