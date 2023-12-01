const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove a specific learning module',
  description: `This endpoint facilitates the deletion of a specific learning module from the system. The removal process includes not only the deletion of the module record but also the associated content and metadata, ensuring data integrity and consistency throughout the platform.

**Authentication:** Users need to be authenticated and possess a valid session to interact with this endpoint. Attempts to access it without proper authentication will be rejected.

**Permissions:** To use this endpoint, the user must have the 'manage_learning_path' permission, signifying they have the authority to modify or remove learning modules within the system.

Upon receiving a deletion request, the handler initiates the \`removeModule\` method defined in the \`modules\` core. It consumes the module identifier from the request parameters to locate the specific learning module to be deleted. The \`removeModule\` logic performs a series of operations, such as validating the existence of the module, ensuring the user has the authority to delete it, and proceeding with the actual deletion of the module & related data. These operations encompass transactional database commands that either fully complete or rollback to safeguard against partial modifications. The final response confirms the successful removal of the module or returns an error message detailing any issues encountered during the process.`,
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
