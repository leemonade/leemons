const { schema } = require('./schemas/response/saveMultipleFieldsRest');
const {
  schema: xRequest,
} = require('./schemas/request/saveMultipleFieldsRest');

const openapi = {
  summary: 'Saves multiple fields to a dataset schema',
  description: `This endpoint allows for the bulk addition or update of fields within a specific dataset schema. It handles multiple fields at once, streamlining schema modifications and ensuring data structure consistency.

**Authentication:** Users must be authenticated to modify dataset schemas. Modifications without proper authentication will be rejected.

**Permissions:** Users need to have 'write' access to the dataset schema. Without the necessary permissions, the endpoint will deny the request.

Upon receiving a request, the \`saveMultipleFieldsRest\` action validates the input data against the dataset schema structure. It then calls the \`saveMultipleFields\` method, which is responsible for processing each field in the request. This method ensures that each field addition or update respects the schema's integrity and handles any necessary data transformations. Afterward, it persists the changes to the dataset schema in the database. Finally, a response is generated that summarizes the outcome of the operations, including any fields that were successfully saved or any errors encountered during the process.`,
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
