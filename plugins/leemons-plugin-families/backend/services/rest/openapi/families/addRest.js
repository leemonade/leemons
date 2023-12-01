const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Adds a new family record',
  description: `This endpoint facilitates the creation of a new family record within the system. It processes the input data pertaining to the family and stores it in the corresponding database tables.

**Authentication:** Users need to be authenticated to create a new family record. The action will be rejected if the user's credentials are invalid or absent.

**Permissions:** This endpoint requires specific permissions, namely the ability to create new family records. Users without the proper permissions will not be allowed to perform this action.

Upon receiving the request, the \`add\` action in the families service is called. This action involves several steps to ensure the successful creation of a family record. Initially, it validates the provided input data against pre-defined schemas to prevent any malformed or incorrect data from being processed. Post-validation, the service interacts with the \`Family\` model to insert the new data into the database. Consecutively, any additional operations, such as updating related systems or notifying stakeholders of the new family record, are carried out. The response returned to the client includes details of the successfully created family, typically in the form of a JSON object containing the family's unique identifier and other relevant data.`,
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
