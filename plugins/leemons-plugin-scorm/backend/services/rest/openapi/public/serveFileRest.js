const { schema } = require('./schemas/response/serveFileRest');
const { schema: xRequest } = require('./schemas/request/serveFileRest');

const openapi = {
  summary: 'Serve SCORM content securely',
  description: `This endpoint is responsible for securely delivering SCORM packages to authenticated users. The service ensures that only approved users can access the specific SCORM content, providing a vital layer in content security and compliance with eLearning standards.

**Authentication:** User authentication is crucial for this endpoint. Users must provide valid credentials to access SCORM content. The service validates these credentials before serving any content, rejecting access attempts with invalid authentication tokens.

**Permissions:** The access to SCORM content is tightly controlled. Users need specific permissions related to eLearning course access, which are verified during the request handling. Lack of adequate permissions results in access being denied.

Upon receiving a request, the \`serveFileRest\` handler first checks the user's authentication status and permissions associated with the SCORM content being requested. It utilizes methods such as \`verifyUserAuth\` and \`checkPermissions\` to ensure that these criteria are met. If the user is authenticated and has the necessary permissions, the method then proceeds to fetch the requested SCORM file from the server's secure storage using the \`getSCORMFile\` method. This process involves accessing the filesystem securely to retrieve and serve the content to the user. The response includes the SCORM package data, delivered in a manner that adheres to HTTP and content security protocols.`,
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
