const { schema } = require('./schemas/response/infoRest');
const { schema: xRequest } = require('./schemas/request/infoRest');

const openapi = {
  summary: 'Provide detailed deployment information',
  description: `This endpoint fetches and provides detailed information regarding deployment processes managed by the Deployment Manager. This information helps users track the deployment state, access configuration details, and understand the overall progress and status of their deployment tasks.

**Authentication:** User authentication is required to access deployment details. Access is denied if authentication credentials are invalid or absent.

**Permissions:** To access this endpoint, users need specific permissions related to viewing deployment statuses. The exact permissions required are defined in the deployment manager's security configurations.

Initially, the endpoint triggers the \`fetchDeploymentDetails\` method, which involves querying the database for detailed records pertaining to ongoing or completed deployments. This method processes the query result to format and structure the data accurately, ensuring it includes all necessary information about each deployment phase. This formatted data is then returned to the user via a well-defined JSON response structure, enabling the client's application to display or utilize the detailed deployment information effectively.`,
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
