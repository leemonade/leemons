const { schema } = require('./schemas/response/removeFieldRest');
const { schema: xRequest } = require('./schemas/request/removeFieldRest');

const openapi = {
  summary: 'Remove a field from an existing dataset schema',
  description: `This endpoint allows for the removal of a specific field from an existing dataset schema. The removal process updates the dataset schema so that the specified field is no longer included within it.

**Authentication:** Users must be authenticated to perform this operation. Requests without proper authentication will be rejected.

**Permissions:** Appropriate permissions are required to modify a dataset schema. Users without the necessary permissions to alter dataset schemas will be unable to remove fields.

Upon receiving a request, the \`removeFieldRest\` handler calls the \`removeField\` method from the \`datasetSchema\` core service with necessary parameters that identify the dataset and the field to be removed. This method interacts with the underlying database or schema storage to update the dataset definition by excluding the specified field. It ensures that any dependencies or constraints related to the field are appropriately handled during the removal process. The outcome is then returned to the requester, indicating the successful removal of the field or providing details in the case of an error.`,
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
