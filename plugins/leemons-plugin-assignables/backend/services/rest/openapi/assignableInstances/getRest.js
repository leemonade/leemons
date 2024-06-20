const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary:
    'Manages instances of assignables related to specific telemetry configurations',
  description: `This endpoint manages the creation, update, and deletion of assignable instances within the Leemons platform, specifically focusing on elements related to telemetry configurations. The handling includes operations like setting up initial instances based on templates, updating existing configurations, or removing them as necessary based on user actions or system requirements.

**Authentication:** User authentication is mandatory to ensure secure access to assignable instances. The system validates the authenticity of the user's credentials before processing any operations.

**Permissions:** Appropriate permissions are required to access this endpoint. Users must have administrative rights or specific role-based permissions that allow them to manage assignable instances and their related configurations.

The action flow begins by validating user context and permissions. Once authentication and authorization are confirmed, the handler invokes various methods depending on the request type: \`createInstance\`, \`updateInstance\`, or \`deleteInstance\`. These methods interact with the platform's backend services to perform database operations that reflect the changes made by the user. The process ensures the accurate application of templates for new instances, updates to existing configurations based on user inputs, or the clean removal of instances when no longer needed. The outcome of these operations is then formatted and sent back to the user as a structured JSON response detailing the status and any relevant instance data.`,
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
