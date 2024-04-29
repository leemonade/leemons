const { schema } = require('./schemas/response/saveFieldRest');
const { schema: xRequest } = require('./schemas/request/saveFieldRest');

const openapi = {
  summary: 'Save field details in a dataset schema',
  description: `This endpoint is responsible for updating or adding field information to a specific dataset schema. It handles the addition or modification of data fields within an existing schema ensuring data integrity and compliance with the defined schema rules.

**Authentication:** User authentication is required to ensure that only authorized personnel can make changes to dataset schemas. Unauthorized access is strictly monitored and prevented.

**Permissions:** Users need the appropriate dataset management permissions. Without sufficient permissions, the operation will not be executed, and an error response will be returned.

The process begins when the endpoint receives a request containing new or updated field details. It first validates the user's authentication and permission levels. Once validated, the endpoint uses the \`saveField\` method from the \`datasetSchema\` core module. This method checks the validity of the provided field data against the existing schema definitions. If the data is valid, it proceeds to either add a new field or update an existing one in the database. The operation's success or failure, along with relevant messages, are then encapsulated in the response sent back to the user.`,
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
