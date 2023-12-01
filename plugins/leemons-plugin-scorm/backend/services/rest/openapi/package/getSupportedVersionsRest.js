const { schema } = require('./schemas/response/getSupportedVersionsRest');
const {
  schema: xRequest,
} = require('./schemas/request/getSupportedVersionsRest');

const openapi = {
  // summary: "Summary",
  description: `
{
    "summary": "Fetches SCORM package support versions",
    "description": "This endpoint is designed for retrieving the list of SCORM versions that the system currently supports. It serves as a utility for users to understand the compatibility range of the SCORM plugin within the platform.

**Authentication:** Access to this endpoint requires the user to be authenticated. Unauthenticated users will not be able to retrieve this information.

**Permissions:** Users must have appropriate permissions to query SCORM support details. Without the necessary permissions, the request will be denied.

This endpoint processes the request by first ensuring that the user is authenticated and authorized to retrieve the list of supported SCORM versions. Upon validation, it invokes the \`getSupportedVersions\` method, which is responsible for gathering the version details. The method performs a lookup within the system configurations or datasets where supported versions are defined. Finally, the list is compiled and returned as a response to the client, formatted as a JSON object containing an array of strings, each representing a supported SCORM version."
}
`,
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
