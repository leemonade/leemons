const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove specific scores from the system',
  description: `This endpoint allows for the deletion of specific scores by their identifiers within the system. The removal process is permanent and cannot be undone, so it must be used with caution to prevent data loss.

**Authentication:** Users must be authenticated to delete scores. Lack of proper authentication will prevent access to this endpoint.

**Permissions:** This endpoint requires that the authenticated user has the necessary permissions to alter score data. These permissions ensure that only authorized personnel can delete scores, maintaining the integrity of the system.

Upon receiving a request, the handler calls the \`removeScores\` method in the \`scores\` core module. It processes the request parameters to identify which scores to delete. The \`removeScores\` method interacts with the database to execute the deletion of the scores identified in the parameters. After successful deletion, the response to the client indicates that the operation has completed, though specific details of the deletion are typically not included in the response for security reasons.`,
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
