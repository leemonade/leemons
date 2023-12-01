const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add a new period to the educational system',
  description: `This endpoint is responsible for adding a new period, such as a semester or a trimester, to the educational system's calendar. A period typically represents a division of the academic year and is crucial for organizing courses, evaluations, and other educational activities.

**Authentication:** Users need to be authenticated and possess a valid session token to invoke this endpoint. Unauthorized attempts to add a period will be rejected.

**Permissions:** The user must have administrative privileges or specific permission to manage academic periods. Without the necessary permissions, the endpoint will deny the request to add a new period.

Upon receiving a request, the handler begins by validating the provided period details using the \`validatePeriod\` method. This method ensures that all necessary information conforms to established data formats and requirements. Next, the validated data is passed to the \`addPeriod\` function within the 'periods' core, which handles the insertion of the new period information into the educational system's database. The process involves database transactions to maintain data integrity. Once the period is successfully added, the endpoint responds with the details of the newly created period, including its unique identifier and associated metadata, in a structured JSON format.`,
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
