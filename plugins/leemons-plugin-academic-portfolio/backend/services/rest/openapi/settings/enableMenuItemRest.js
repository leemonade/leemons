const { schema } = require('./schemas/response/enableMenuItemRest');
const { schema: xRequest } = require('./schemas/request/enableMenuItemRest');

const openapi = {
  summary: 'Enables a specific menu item for the academic portfolio',
  description: `This endpoint enables a particular menu item within the academic portfolio system. The toggle primarily targets administrative functionalities that are driven by the UI component configuration, allowing for modular activation or deactivation of features.

**Authentication:** User must be authenticated to modify the menu item settings. An invalid or missing authentication token will prevent access to this endpoint.

**Permissions:** The user requires administrative permissions specifically tailored for configuration or settings management within the academic portfolio. Without these permissions, the endpoint restricts execution of the command.

The endpoint workflow involves calling the \`enableMenuItem\` method which is part of the \`SettingsService\`. Once invoked, the method receives an identifier for the menu item and toggles its state to enabled. This process modifies the system's configuration, reflecting changes immediately across user interfaces that depend on these menu settings. The comprehensive handling ensures that only authorized users can alter the state of user interface components, maintaining system integrity and user-specific customization.`,
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
