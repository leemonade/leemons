const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Removes a family record from the database',
  description: `This endpoint is responsible for the deletion of a family record in the platform's database. It allows authorized users to remove families and all associated data, ensuring that the deletion process adheres to data integrity and the constraints defined within the system.

**Authentication:** The user must be authenticated to carry out this action. If the user's identity cannot be verified, the endpoint will reject the request.

**Permissions:** The user requires specific permissions to delete a family record. The needed permissions must be checked before allowing the operation, ensuring that only users with the right access level can perform a deletion.

Upon receiving a request to delete a family, the \`removeRest\` handler first verifies the user's credentials and checks if the user has the necessary permissions to perform the deletion. If authentication and authorization are successful, the handler proceeds to call the \`remove\` method from the \`families\` core service. This method is responsible for carrying out the deletion operation, which includes removing the family record from the database and any other related data such as associated family member records, and dataset values linked to the family. The operation ensures that all deletions are transactional and that the database remains in a consistent state afterwards. Once the deletion is successfully completed, a confirmation response is returned to the client.`,
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
