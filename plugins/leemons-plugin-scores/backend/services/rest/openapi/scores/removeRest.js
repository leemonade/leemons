const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Removes specified score records',
  description: `This endpoint handles the deletion of score records from the system. Authorized users can request the removal of specific scores identified by their unique identifiers. The operation ensures that only permissible records are deleted based on user rights and provided identifiers.

**Authentication:** Users need to be authenticated to issue deletion commands for score records. Unauthenticated requests will be rejected, ensuring that only valid users can perform deletions.

**Permissions:** The user must have the 'delete_scores' permission assigned to their role. Without this permission, the attempt to delete scores will be denied, ensuring system-wide integrity and access control are maintained.

Upon receiving a delete request, the 'removeScores' handler in the 'scores.rest.js' service invokes the 'remove' method from the 'ScoresService'. The method uses parameters passed in the request to identify and validate the scores that should be deleted. It checks for user permissions and the existence of the scores in the database. If the validations pass, it proceeds to remove the scores. The process involves database operations to securely delete the records and then confirm the success of the operation to the user through an appropriate HTTP response.`,
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
