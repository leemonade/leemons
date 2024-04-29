const { schema } = require('./schemas/response/saveRest');
const { schema: xRequest } = require('./schemas/request/saveRest');

const openapi = {
  summary: 'Save regional configuration settings',
  description: `This endpoint is responsible for saving the regional configurations for an academic calendar. The configurations may include settings like timezone, holiday schedules, and academic periods specific to a region or institution.

**Authentication:** Users must be authenticated to modify regional configurations. An absence of valid authentication will prevent access to this endpoint.

**Permissions:** Appropriate permissions are required to access this endpoint. Typically, only users with administrative rights or specific roles such as 'Academic Administrator' can update regional settings.

Upon receiving the request, the handler in 'regionalConfig.rest.js' invokes the 'saveRegionalConfig' method from the 'regional-config' core module. This method processes the input data, ensuring all necessary validations are met, using the validation schema defined in 'forms.js'. If the data passes all validations, it proceeds to update or create the regional settings in the database. The result of this operation is then formulated into a response that confirms the success of the operation or provides error messages in case of failure.`,
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
