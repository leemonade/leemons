const { schema } = require('./schemas/response/publicFolderRest');
const { schema: xRequest } = require('./schemas/request/publicFolderRest');

const openapi = {
  summary: 'Access and manage public files',
  description: `This endpoint enables users to access and manage files within a specified public folder. It allows the retrieval, addition, and updating of files in the public folder based on provided actions and parameters.

**Authentication:** Users need to be authenticated to interact with public files. The authentication ensures that only authorized users can perform operations on files within the public folder.

**Permissions:** This endpoint requires users to have specific permissions related to file management. The necessary permissions include reading, writing, and managing public files, depending on the action requested by the user.

The controller handler starts with the validation of user credentials and permissions. Once authentication and authorization are confirmed, it processes the incoming request to determine the required action (e.g., retrieve, add, or update files). Depending on the action, it interacts with the filesystem or database to perform the respective file operation. The process involves creating, reading, or modifying files within the public folder. Finally, the result of the operation is structured into an appropriate response format and sent back to the user, detailing the outcome of their request.`,
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
