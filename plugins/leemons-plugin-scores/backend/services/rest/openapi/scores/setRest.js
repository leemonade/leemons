const { schema } = require('./schemas/response/setRest');
const { schema: xRequest } = require('./schemas/request/setRest');

const openapi = {
  summary: 'Set academic scores for students',
  description: `This endpoint is responsible for setting academic scores for students. It allows the bulk updating of scores across different subjects and terms as defined within the system's academic structures.

**Authentication:** Users need to be authenticated in order to submit changes to students' scores. Missing or invalid authentication tokens will prevent access to this functionality.

**Permissions:** This endpoint requires administrative rights or specific educator access to modify students' scores. Permissions are checked at the beginning of the request process to ensure the user possesses the necessary rights to update scores.

The process of setting scores begins with the \`setScores\` method in the scores service. This method receives a request containing the details of the scores to be updated, including student identifiers, the academic subjects, and the respective scores. It then performs a validation to ensure that all provided data meets the system's requirements and that the user has the right to modify these scores. Upon successful validation, it updates the scores in the database, logging each transaction for audit purposes. Finally, a response is generated and sent back to the client, indicating the status of the update operation, whether it was successful or if there were any errors.`,
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
