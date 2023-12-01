const { schema } = require('./schemas/response/setRest');
const { schema: xRequest } = require('./schemas/request/setRest');

const openapi = {
  summary: 'Set scores for user assessments',
  description: `This endpoint allows for the updating or creation of score records associated with user assessments. Scores are critical data points in the educational context and this endpoint facilitates the recording of such information in the system.

**Authentication:** Users need to be authenticated to submit scores. Access is restricted to authenticated users only, and privileges are checked to ensure proper authorization to modify score records.

**Permissions:** The endpoint requires certain permissions, typically those associated with instructor-level access or administrative privileges. Users must have the ability to create or update scores within the scope of their roles and the associated programs or courses.

Internally, the endpoint triggers the \`setScores\` method within the \`Scores\` core service. The process begins with validating the provided data against predefined schemas to ensure they meet the required format and completeness. Afterward, depending on whether it is a new score record or an update to an existing one, the service either inserts data into the database or modifies the existing records. Any potential conflicts or errors in the process are handled accordingly, with appropriate responses sent back to the client. The final output of this endpoint is a success message along with the updated or newly created score records, confirming the successful recording of the assessment data.`,
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
