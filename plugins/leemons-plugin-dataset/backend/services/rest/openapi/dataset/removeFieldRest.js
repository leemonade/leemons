const { schema } = require('./schemas/response/removeFieldRest');
const { schema: xRequest } = require('./schemas/request/removeFieldRest');

const openapi = {
  summary: 'Removes a specified field from a dataset schema',
  description: `This endpoint allows the deletion of a specific field from an existing dataset schema. The action updates the schema configuration by removing field entries and any associated validations or dependencies linked to that field in the dataset.

**Authentication:** Users need to be authenticated to perform this operation. Any requests made without proper authentication will be rejected and the user will not be able to access the endpoint.

**Permissions:** Users must have editing permissions on the dataset schema to execute this action. The necessary permissions are checked against the user's role and access rights before proceeding with the deletion of the field.

The process begins when the \`removeFieldRest\` action in \`dataset.rest.js\` receives a request specifying the field to be removed. It utilizes the \`removeField\` method from \`datasetSchema\` core module. The method performs a validation check using \`exists.js\` to ensure the dataset and the field exists before proceeding. Upon successful validation, it updates the schema by removing the field entry and updates any dependencies in the dataset. The updated dataset schema is saved and a success response is returned to the user, confirming that the field has been removed.`,
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
