const { schema } = require('./schemas/response/listClassRest');
const { schema: xRequest } = require('./schemas/request/listClassRest');

const openapi = {
  summary: 'Lists all classes associated with a specific academic program',
  description: `This endpoint is responsible for providing a list of classes that are part of a given academic program. The data returned may include class details such as the class ID, name, description, and any other relevant metadata associated with the academic classes.

**Authentication:** User authentication is required to access this endpoint. Unauthenticated users will not be able to retrieve any class information.

**Permissions:** Users need to have the appropriate permissions to view class data within the academic program. This typically includes permissions like 'view_classes' or specific roles that have access rights to academic information.

Upon receiving a request, this endpoint first validates the user's authentication and permissions. If the validation is successful, it proceeds to call the \`listClasses\` method from the \`class.rest\` service. This method interacts with the underlying data store to retrieve all classes linked to the academic program specified in the request. It may involve complex queries, especially if the program structure is hierarchical or involves multiple subjects and courses. The flow also includes error handling to respond appropriately in case of missing data or access violations. The final response from this endpoint is a well-structured JSON object that encapsulates the details of the classes within the specified academic program.`,
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
