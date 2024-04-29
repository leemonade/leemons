const { schema } = require('./schemas/response/removeClassRest');
const { schema: xRequest } = require('./schemas/request/removeClassRest');

const openapi = {
  summary: 'Removes multiple class entities by their IDs',
  description: `This endpoint is designed to handle the removal of several class entities specified by their unique identifiers within the academic portfolio system. The process ensures that the specific classes are correctly identified and then deleted from the system's database.

**Authentication:** Users must be authenticated to execute this operation. Access to this functionality will be denied if authentication credentials are invalid or absent.

**Permissions:** This endpoint requires that the user has administrative rights or specific permissions related to academic class management. Without these permissions, the request will be rejected.

The endpoint initiates by interpreting the received class IDs provided in the request. It calls the \`removeClassesByIds\` method from the \`Classes\` core module. This method internally checks each ID to confirm their existence and validates the user's permission to delete each class. Once validation is complete, it proceeds to delete the classes from the system's database. The transaction ensures atomicity to make sure all specified classes are removed effectively and safely. Upon successful completion of the operation, the response confirms the successful deletion of the classes, and in the case of any error during the process, an error message is returned specifying the issue.`,
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
