const { schema } = require('./schemas/response/getProgramEvaluationSystemRest');
const {
  schema: xRequest,
} = require('./schemas/request/getProgramEvaluationSystemRest');

const openapi = {
  summary: "Retrieve the program's evaluation system",
  description: `This endpoint facilitates the retrieval of the evaluation system specifics for a given academic program. The focus is on providing detailed settings pertaining to how program performances are assessed, including grading schemes and evaluation procedures.

**Authentication:** User authentication is a prerequisite for accessing this information. An absence of proper authentication will prevent access to the endpoint.

**Permissions:** This endpoint requires that the user has administrative rights within the academic program. Specific permission checks include verifying user roles such as administrator or faculty member before proceeding.

Upon receiving a request, this handler invokes the \`getProgramEvaluationSystem\` method from the \`programs\` core module. This method performs a query to fetch the evaluation system details from the program's data storage by leveraging the program identifier provided in the request. The comprehensive flow from request to response ensures that only authorized and authenticated users can access precise and relevant evaluation system data, adhered to predetermined permission protocols. The successful completion of the query resolves in transmitting the evaluation system data back to the requester through a meticulously structured JSON response.`,
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
