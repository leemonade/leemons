const { schema } = require('./schemas/response/createRest');
const { schema: xRequest } = require('./schemas/request/createRest');

const openapi = {
  summary: 'Create a new learning path module',
  description: `This endpoint is designed to facilitate the creation of a new learning path module within the platform. It enables the structured addition of educational content, configuring each module to fit specific learning objectives and outcomes.

**Authentication:** User authentication is mandatory to ensure that only authorized personnel can create learning path modules. Unauthorized access attempts will be rejected.

**Permissions:** Users need to have the 'create_module' permission to be allowed to create new modules. Attempting to create a module without the required permissions will result in access being denied.

During the process, the handler calls the \`createModule\` method from the \`modules\` core, which takes the input provided through the request body. This input is then validated and transformed as needed to comply with the system's data schema. After successful validation, the new module data is persisted into the database through a dedicated method, effectively storing the module. The handler returns a response confirming successful module creation, including any relevant module data as part of the response body.`,
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
