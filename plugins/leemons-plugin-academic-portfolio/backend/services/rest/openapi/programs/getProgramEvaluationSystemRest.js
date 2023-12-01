const { schema } = require('./schemas/response/getProgramEvaluationSystemRest');
const {
  schema: xRequest,
} = require('./schemas/request/getProgramEvaluationSystemRest');

const openapi = {
  summary: 'Fetches the evaluation system for a specified academic program',
  description: `This endpoint allows retrieval of the evaluation system associated with a specific academic program. It is intended to provide clients with details on how a program’s performance is assessed, including grading scales, criteria, and any other relevant metrics used to evaluate the outcomes of the program participants.

**Authentication:** Users must be authenticated to access the evaluation system of an academic program. Authentication ensures that a request is made by a valid user who has appropriate access rights.

**Permissions:** The endpoint requires the user to have permissions to view academic program details. This may include roles such as academic administrators, instructors, or other staff with permission to view program evaluation methodologies.

Upon receiving a request, the handler initially validates the user's authentication and authorization to ensure they have the necessary permissions to access the information. Once verified, it proceeds to call the \`getProgramEvaluationSystem\` method from the \`programs\` core module. This method interacts with the underlying data layer to retrieve the specific evaluation system linked to the provided program identifier. The handler then formats the retrieved data as per predefined response structures and returns it to the client in a structured JSON format, ultimately concluding the request-response cycle.`,
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
