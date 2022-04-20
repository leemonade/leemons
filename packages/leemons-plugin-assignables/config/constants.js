const assignableActions = ['edit', 'view', 'view+student', 'assign', 'delete'];
const assignableRoles = ['viewer', 'student', 'editor', 'owner'];
const assignableRolesObject = {
  owner: {
    actions: assignableActions,
    canAssign: assignableRoles,
  },
  editor: {
    actions: ['edit', 'view', 'assign'],
    canAssign: ['viewer', 'student'],
  },
  viewer: {
    actions: ['view'],
    canAssign: [],
  },
  student: {
    actions: ['view', 'view+student'],
    canAssign: [],
  },
};

const assignableInstanceActions = ['view'];
const assignableInstanceRoles = ['student', 'class'];
const assignableInstanceRolesObject = {
  student: {
    actions: ['view'],
    canAssign: [],
  },
  class: {
    actions: ['view'],
    canAssign: [],
  },
};

module.exports = {
  assignableRoles,
  assignableActions,
  assignableRolesObject,

  assignableInstanceRoles,
  assignableInstanceActions,
  assignableInstanceRolesObject,
};
