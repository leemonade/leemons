const { schema } = require('./schemas/response/detailRest');
const { schema: xRequest } = require('./schemas/request/detailRest');

const openapi = {
  summary: 'Manage session details for attendance control',
  description: `This endpoint is responsible for handling specific session-related requests in the attendance control module. It facilitates detailed operations on sessions such as retrieving, updating, or deleting session information based on given criteria.

**Authentication:** User authentication is mandatory to ensure secure access to session details. Access is denied for requests without valid authentication credentials.

**Permissions:** Users need specific permissions related to attendance control management. Without the required permissions, the request will not be processed.

The flow of the controller involves several key methods orchestrated to manage session details effectively. Initially, the endpoint extracts necessary details from the incoming request (such as session identifiers or relevant parameters). It then interacts with the \`session\` core model to execute operations like \`getSessionDetailsById\`, \`updateSession\`, or \`deleteSession\`. These operations involve querying the database and manipulating session data as requested. The processes are securely handled, ensuring that only authorized actions are performed, corresponding to the authenticated user's permission levels. The response is carefully formatted to provide clear and accurate session details or status updates, depending on the operation performed.`,
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
