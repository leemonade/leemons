const { schema } = require('./schemas/response/getSystemDataFieldsConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/getSystemDataFieldsConfigRest');

const openapi = {
  summary: 'Retrieves system data configuration fields for users',
  description: `This endpoint enables system administrators to fetch the configuration of system data fields related to user accounts. It primarily aims at providing a structured set of data fields that can be utilized for user profile creation, modification, and validation purposes.

**Authentication:** This endpoint requires the user to be authenticated as a system administrator. Unauthorized access attempts will be declined, and proper authentication credentials must be provided by the client.

**Permissions:** The endpoint mandates that the accessing user holds system-level administrative permissions. These permissions are critical to ensure that only authorized personnel can access and manipulate the sensitive system-level user data configuration.

Upon invocation, the \`getSystemDataFieldsConfigRest\` handler commences by authenticating the user's request against the administrative credentials. Assuming authentication succeeds, the handler then calls the \`getSystemDataFieldsConfig\` function from the \`leemons-plugin-users\` core configuration module. This function reads from the relevant configuration store, typically a file or database, where system data fields settings are maintained. After retrieval, the function returns these settings to the handler. The handler, in turn, processes this data, potentially performing format conversion or validation, and ultimately sends it back to the requester in a JSON format that details the specifics of each system data field available for user accounts.`,
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
