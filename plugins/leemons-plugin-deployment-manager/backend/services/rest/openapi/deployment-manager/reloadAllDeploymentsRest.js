const { schema } = require('./schemas/response/reloadAllDeploymentsRest');
const {
  schema: xRequest,
} = require('./schemas/request/reloadAllDeploymentsRest');

const openapi = {
  summary: 'Reload all deployment configurations',
  description: `This endpoint reloads all the deployment configurations from the storage, ensuring that any updates or changes in the deployment settings are immediately reflected across the system. This is crucial for maintaining consistency and up-to-date operation parameters in dynamic environments.

**Authentication:** Access to this endpoint requires the user to be authenticated. Without valid authentication, the system will deny access to this service.

**Permissions:** Users must have administrative permissions specifically for deployment management. Access without sufficient permissions will result in a denial of service error.

The handler initiates by fetching all deployment configurations using the \`getAllDeployments\` method. This method interacts with the underlying database or file system to retrieve updated configurations. Upon successful retrieval, the system iterates through each deployment configuration to apply necessary updates or reinitializations as needed. This comprehensive refresh ensures that any subsystem or service relying on these configurations is synchronized with the latest deployment settings. The response concludes with a confirmation message indicating successful reload or an error message detailing any issues encountered during the process.`,
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
