const { schema } = require('./schemas/response/deleteConfigRest');
const { schema: xRequest } = require('./schemas/request/deleteConfigRest');

const openapi = {
  summary: 'Deletes configuration settings for a specific provider',
  description: `This endpoint is responsible for deleting the configuration settings associated with a given provider within the system. It effectively removes the custom settings, returning the provider to its default state or removing any linkage between the provider and its current configurations.

**Authentication:** Only authenticated users with the necessary privileges can perform a deletion of a provider's configuration settings. Without proper authentication, the request will be rejected.

**Permissions:** To access this endpoint, users must have appropriate permissions to manage provider configurations. Any attempt without sufficient permissions will result in an access denial.

Upon receiving a request, the handler commences by verifying the user's authentication status and checking their permissions against the required level for deleting a provider's configuration. It then proceeds to call a method that will remove the specific configuration settings from the database. This involves unpersisting any data related to the provider's configurations and ensuring no traces remain that could affect further operations. After the deletion operation completes, the handler sends an appropriate HTTP response signaling the successful removal of the settings or providing an error message if the operation failed.`,
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
