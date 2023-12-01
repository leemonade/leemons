const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  // summary: "Summary",
  description: `
{
  "summary": "List all roles within the system",
  "description": "This endpoint provides a comprehensive list of all the distinct roles available within the system. It compiles the roles in a way that can be used to understand the different levels of access and their corresponding capabilities.
  
**Authentication:** Access to this endpoint requires the user to be authenticated. If authentication fails or is not provided, the user will not be able to retrieve the list of roles.

**Permissions:** The user must have the appropriate permissions to view the list of roles. Without these permissions, the endpoint will reject the request.

Upon receiving a request, the handler calls the \`list\` method defined in the \`roles\` service. This method interacts with the system's underlying datastore to retrieve all stored roles. It then formats this data into a structured list that is returned to the requester. Each role includes metadata such as its unique identifier and description of the role's purpose and level of access. The flow from request to response involves checking user authentication and permissions before executing the query, and finally sending the result back to the user in a clean, organized JSON format."
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
