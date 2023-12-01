const { schema } = require('./schemas/response/saveFieldRest');
const { schema: xRequest } = require('./schemas/request/saveFieldRest');

const openapi = {
  summary: 'Saves a new field to the dataset schema',
  description: `This endpoint manages the addition of a new field to a given dataset schema. It ensures that the new field adheres to the predefined structure and validation rules set for the dataset. The operation includes validating the field's data type, constraints, and any specific metadata required as per the dataset schema definition.

**Authentication:** Users are required to be authenticated to perform this operation. The endpoint will validate the user's credentials and session before proceeding with the update of the dataset schema.

**Permissions:** Adequate permissions are necessary for a user to add a new field to the dataset schema. Without proper authorization, the endpoint will restrict access, ensuring that only users with the right to modify the dataset schema can introduce new fields.

Upon receiving a request with the new field details, the endpoint first conducts a series of validations using internal validation methods such as \`exists.js\` and \`datasetSchema.js\`. If the validation succeeds, it proceeds to call \`saveField.js\` from the \`datasetSchema\` core logic, which handles the intricacies of updating the schema with the new field information. This operation might include altering database tables or structures, updating schema registries, and so on. Once the addition of the new field is successfully completed, the endpoint sends back a confirmation response indicating the successful update of the dataset schema.`,
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
