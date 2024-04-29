const { schema } = require('./schemas/response/deleteCurriculumRest');
const { schema: xRequest } = require('./schemas/request/deleteCurriculumRest');

const openapi = {
  summary: 'Delete a specified curriculum',
  description: `This endpoint deletes a curriculum based on the provided curriculum ID. It is designed to handle deletion operations for curriculums in the Leemons platform, ensuring data associated with the curriculum is appropriately removed from the system.

**Authentication:** Users need to be authenticated to perform deletion operations on curriculums. A valid authentication token must be presented to access this endpoint.

**Permissions:** This endpoint requires the user to have administrative rights or specific deletion permissions related to curriculum management. Without the necessary permissions, the request will be denied.

Upon receiving a delete request, the endpoint first validates the user's authentication and checks for the required permissions. If both checks are passed, it proceeds to invoke the \`deleteCurriculum\` method from the \`curriculum\` core. This method is responsible for all operations related to the removal of the curriculum from the database, including the deletion of any linked data that might disrupt the system's integrity if left behind. The operation's success or failure is then communicated back to the user through an appropriate HTTP response message, completing the curriculum deletion process.`,
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
