const { schema } = require('./schemas/response/removeClassRest');
const { schema: xRequest } = require('./schemas/request/removeClassRest');

const openapi = {
  summary: 'Remove classes by specified IDs',
  description: `This endpoint is responsible for the deletion of classes from the academic portfolio. Classes are identified by their unique IDs provided in the request, and the associated data is permanently removed from the system.

**Authentication:** The user needs to be logged in to perform this operation. Without proper authentication, the request will be rejected.

**Permissions:** Users must have the necessary permissions to delete classes. Typically, this includes administrative rights or specific roles that grant access to managing the academic portfolio.

Upon receiving the request, the \`removeClassRest\` handler delegates the task to the \`removeClassesByIds\` method within the \`classes\` core. It passes the array of class IDs obtained from the request to the method. The \`removeClassesByIds\` method invokes the underlying data layer to execute the deletion operation. Each class is checked against the permission rules to ensure the requestor has rights to delete it. If all verifications pass, the deletion is performed, and the method returns a confirmation of the successful removal. If the process encounters any issues, appropriate error messages are sent back in the response detailing the reason for the failure.`,
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
