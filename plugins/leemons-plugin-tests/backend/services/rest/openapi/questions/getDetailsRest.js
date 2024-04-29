const { schema } = require('./schemas/response/getDetailsRest');
const { schema: xRequest } = require('./schemas/request/getDetailsRest');

const openapi = {
  summary: 'Fetches question details based on provided IDs',
  description: `This endpoint retrieves detailed information about a set of questions identified by their unique IDs. The operation is meant to gather detailed data including text, options, and expected answers for these questions, which could be used for assessments or information display purposes.

**Authentication:** Users need to be authenticated in order to access question details. Unauthenticated requests will be denied access to this endpoint.

**Permissions:** The endpoint requires users to have the 'view_questions' permission to ensure that only authorized users can fetch question details. Additional checks may be done against each question ID to verify that the user has access to the specific information.

The endpoint internally calls the \`getByIds\` method provided by the questions core API. This method takes an array of question IDs from the request and executes a query to retrieve their details from the database. Each question's data is then processed to include necessary information such as question text, choices, correct answers, and any additional metadata. The response from the API encapsulates this data in a structured format, responding back to the client with the requested question details in JSON.`,
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
