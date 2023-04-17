const permissionsPrefix = 'plugins.mqtt-aws-iot';

const permissionNames = {};

const removePermissions = [`${permissionsPrefix}.config`];
const permissions = [];

const permissionsBundles = {};

const menuItems = [];

const removeMenuItems = ['aws-iot'];

const widgets = {
  zones: [],
  items: [
    {
      zoneKey: `plugins.admin.admin-page`,
      key: `${permissionsPrefix}.admin.config`,
      url: 'admin-config/index',
      properties: {
        card: {
          headerColor: '#EEEAF7',
          title: `${permissionsPrefix}.admin.card.title`,
          image: '',
          imageWidth: 0,
          imageHeight: 0,
          description: `${permissionsPrefix}.admin.card.description`,
        },
      },
    },
  ],
};

module.exports = {
  pluginName: permissionsPrefix,
  permissions: {
    removePermissions,
    permissions,
    names: permissionNames,
    bundles: permissionsBundles,
  },
  removeMenuItems,
  menuItems,
  widgets,
};
