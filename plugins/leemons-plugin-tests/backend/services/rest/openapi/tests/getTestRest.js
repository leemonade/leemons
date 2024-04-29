const { schema } = require('./schemas/response/getTestRest');
const { schema: xRequest } = require('./schemas/request/getTestRest');

const openapi = {
  summary: 'Fetch detailed test information based on test ID',
  description: `This endpoint retrieves detailed information about a specific test by its unique identifier. It is primarily used to obtain all relevant details required by the frontend to display or process a particular test.

**Authentication:** Users need to be authenticated to request test details to ensure that the information is secure and only accessible to users within the permitted roles or access rights.

**Permissions:** This endpoint requires the user to have 'view_tests' permission. Without this permission, the user's request to access test details will be denied, safeguarding sensitive test information.

Upon receiving a request, the handler first verifies that the user is authenticated and has the necessary permissions. If these conditions are met, the handler calls a service method specifically designed to fetch test data from the database using the provided test ID. This method incorporates business logic to handle different scenarios such as test availability or access rights. Finally, the processed data, which includes complete test details such as questions, configurations, and metadata, is returned to the user formatted as a JSON object.`,
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
