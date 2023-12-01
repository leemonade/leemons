const { schema } = require('./schemas/response/findOneRest');
const { schema: xRequest } = require('./schemas/request/findOneRest');

const openapi = {
  summary: 'Fetch specific timetable settings',
  description: `This endpoint retrieves the specific settings of a timetable based on given criteria. It is typically used for fetching configuration details like time slots, class duration, or any custom settings associated with a particular timetable setup.

**Authentication:** Users need to be authenticated to fetch timetable settings. Unauthorized access will be prohibited, and the system will return an authentication error.

**Permissions:** The requesting user must have the necessary permissions to view timetable settings. Without the appropriate permissions, the user will receive an error indicating insufficient permissions.

Upon receiving a request, the \`findOneRest\` handler calls the \`findOne\` method in the \`settings\` core module. The \`findOne\` method interacts with the underlying datastore to retrieve the specific settings for the requested timetable. The process includes validating the user's authentication and authorization, constructing a query based on the provided criteria (such as identifiers or configuration keys), and performing a lookup operation in the database. If the sought settings are found, they are returned to the user formatted as JSON. If no settings match the criteria, the endpoint responds with a 'not found' error. Throughout the process, error handling mechanisms ensure that any operational issues result in informative error messages sent back to the client.`,
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
