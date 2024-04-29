const { schema } = require('./schemas/response/putGradeRest');
const { schema: xRequest } = require('./schemas/request/putGradeRest');

const openapi = {
  summary: 'Updates a specific grade based on provided details',
  description: `This endpoint allows for the updating of specific grade details within the system. It updates a grade entry based on the provided identifiers and new data values. This function typically handles changes in grade values, status, or associated metadata.

**Authentication:** Users must be authenticated to update grade information. An invalid or missing authentication token will result in denied access to this endpoint.

**Permissions:** The endpoint requires that the user has the appropriate rights to modify grade data, generally restricted to administrative or educational staff roles who manage grade records.

Upon receiving the request, the handler first verifies user authentication and permissions. Assuming these checks pass, it proceeds to invoke the \`updateGrade\` method from the \`grades\` core. This method accepts the unique grade ID and the new data for the grade as parameters, interacting with the database to update the relevant grade entry. The operation's success or failure is communicated back to the client through a standard HTTP response, encapsulating either the updated grade data or an error message detailing why the operation could not be completed.`,
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
