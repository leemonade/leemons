const { schema } = require('./schemas/response/deleteRest');
const { schema: xRequest } = require('./schemas/request/deleteRest');

const openapi = {
  summary: 'Delete a specific timetable',
  description: `This endpoint allows for the deletion of a specific timetable from the system. The action involves identifying the timetable by ID and removing it from the database, ensuring that all references and related data are also appropriately handled.

**Authentication:** Users need to be authenticated to perform deletion operations. Unauthenticated requests will be rejected.

**Permissions:** The user must have the appropriate permissions to delete timetables. Users without sufficient permissions will be prevented from performing this action.

The controller's flow begins by validating the user's authentication and permissions to delete a timetable. Upon validation, it calls the \`deleteTimetable\` method from the \`TimetableService\`, passing the timetable's unique identifier. The service then executes the necessary queries to remove the timetable from the database and ensures that any cascading deletions or cleanups of related records are performed. The final response to the client confirms the successful deletion or provides an error message if the operation failed.`,
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
