const { schema } = require('./schemas/response/searchRest');
const { schema: xRequest } = require('./schemas/request/searchRest');

const openapi = {
  // summary: "Summary",
  description: `
{
  "summary": "Search for task items based on criteria",
  "description": "This endpoint performs a search for tasks within the system using a variety of filters and returns a set of tasks that match the search criteria. The exact search behavior and the nature of the filters are defined by the underlying search logic.

**Authentication:** Users must be authenticated to perform a task search. An authorization mechanism checks for a valid session or token before granting access to the endpoint.

**Permissions:** Access to this endpoint requires 'task-search' permission. Users with insufficient permissions will receive an error.

The endpoint initiates by parsing search parameters from the incoming request. It then calls the \`searchTasks\` function from the \`task\` core, which constructs a query to retrieve tasks from the database according to the provided filters. Following the retrieval operation, additional processing or filtering may be performed on the results, depending on the search implementation details. Finally, a response is prepared and returned to the user, which includes the search results, typically as a JSON array of task objects. Any errors or exceptions encountered during the operation are handled and an appropriate error response is generated."
}
`,
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
