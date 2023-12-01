const { schema } = require('./schemas/response/serveFileRest');
const { schema: xRequest } = require('./schemas/request/serveFileRest');

const openapi = {
  summary: 'Serves the requested SCORM package content',
  description: `This endpoint is responsible for serving specific files contained within a SCORM (Sharable Content Object Reference Model) package. Clients can request multimedia content or other resources as part of a SCORM educational course or activity hosted on the platform.

**Authentication:** Users must be authenticated to request SCORM package contents. Access to files is contingent on a valid session or authentication token.

**Permissions:** Users require the appropriate permissions to access the specific SCORM content associated with their course or educational activity. Access control is managed based on user roles and the permissions assigned to the SCORM content.

Upon receiving a request, the handler validates the user's authentication status and checks whether they have the necessary permissions to access the requested file. It then retrieves the file from the server's filesystem or a content delivery network (CDN) depending on the configuration. The file path and details are derived from the database where the SCORM package's metadata is stored. The handler ensures that only authorized files associated with the user's educational content are served. Finally, the file is streamed or sent as a download to the client's web browser or SCORM player, providing a seamless learning experience.`,
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
