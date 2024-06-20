const { schema } = require('./schemas/response/haveGradesRest');
const { schema: xRequest } = require('./schemas/request/haveGradesRest');

const openapi = {
  summary: 'Check grade availability for a user',
  description: `This endpoint checks if grades are available for a specific user within the system. It determines the presence or absence of grades linked to the user’s profile, which can be useful for functions like displaying grade-related features or analytics on the user interface.

**Authentication:** User authentication is essential for accessing this endpoint. The request must carry a valid authentication token, without which the request will be denied.

**Permissions:** Specific permissions related to accessing or managing grades are required to consume this endpoint. Access without proper permissions will result in a denial of the request.

Upon receiving a request, the \`haveGrades\` method in the backend core logic is invoked with pertinent user identifiers. This method interacts with the database to ascertain whether any grades are recorded against the user ID provided. The process involves querying the database and evaluating the existence of grade entries. If grades are present, the endpoint returns a positive acknowledgment, otherwise a negative one. The flow from request initiation to the response involves authenticating the user, verifying permissions, executing the query, and then formulating the appropriate response based on the query results.`,
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
