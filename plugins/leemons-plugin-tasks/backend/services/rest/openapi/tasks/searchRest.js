const { schema } = require('./schemas/response/searchRest');
const { schema: xRequest } = require('./schemas/request/searchRest');

const openapi = {
  summary: 'Searches and retrieves task details based on specified criteria',
  description: `This endpoint enables the searching and retrieval of tasks based on multiple filter criteria such as tags, status, or deadlines. It facilitates the efficient management and overview of tasks within the leemons platform, allowing users to quickly locate specific tasks or sets of tasks that meet the queried conditions.

**Authentication:** Users need to be authenticated to search tasks. Unauthorized access is strictly controlled and any unauthenticated request will be rejected.

**Permissions:** This endpoint requires that the user has the 'task_view' permission. Users without sufficient permissions will not be able to access task details or carry out searches.

Upon receiving a search request, the \`searchRest\` handler in \`tasks.rest.js\` interacts with the \`search\` function defined in \`search.js\` within the \`leemons-plugin-tasks\` backend. This function constructs a query based on the provided parameters and executes a database search through the Moleculer data service. The searching mechanism can handle various types of filters simultaneously and integrates complex querying capabilities to accommodate different user needs. Once the search is completed, the tasks that match the criteria are compiled and returned in a structured JSON format, providing a concise and detailed view of each task.`,
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
