const assignableActions = ['edit', 'view', 'assign', 'delete'];
const assignableRoles = ['viewer', 'editor', 'owner'];
const assignableRolesObject = {
  owner: {
    actions: assignableActions,
    canAssign: assignableRoles,
  },
  editor: {
    actions: ['edit', 'view', 'assign'],
    canAssign: ['viewer'],
  },
  viewer: {
    actions: ['view'],
    canAssign: [],
  },
};

module.exports = {
  assignableRoles,
  assignableActions,
  assignableRolesObject,
};
