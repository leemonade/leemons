const { schema } = require('./schemas/response/subjectsByIdsRest');
const { schema: xRequest } = require('./schemas/request/subjectsByIdsRest');

const openapi = {
  summary: 'Retrieve subjects based on a list of given IDs',
  description: `This endpoint retrieves detailed information about subjects identified by a list of unique IDs. The data returned typically includes details such as the subject name, category, credits, and associated instructors or departments.

**Authentication:** Access to this endpoint requires the user to be authenticated. An authentication token must be provided, and it's verified to ensure validity before proceeding with data retrieval.

**Permissions:** The user needs specific permissions related to academic data access. Typically, this includes permissions like 'view_subjects' or 'academic_portfolio_access'. Users without the necessary permissions will receive an access denied message.

Upon receiving the request, the \`subjectsByIdsRest\` handler initially validates the presence and formatting of the subject IDs in the request. It then calls the \`subjectByIds\` method located in the \`subjects\` core module. This method is responsible for querying the database for the specified subject IDs, aggregating the required details, and performing any necessary data transformations to conform to the expected response structure. Finally, the handler returns the subject data as a JSON object in the response body, formatted according to the endpoint's specification.`,
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
