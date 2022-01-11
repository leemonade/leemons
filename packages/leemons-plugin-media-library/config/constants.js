module.exports = {
  // EN: The roles must be ordered by allowance. Each role can only assign lower roles.
  // ES: Los roles deben estar ordenados por permisos. Cada rol sólo puede asignar roles inferiores.
  roles: ['public', 'noPermission', 'viewer', 'commentor', 'editor', 'owner'],

  // EN: The permissions each role has.
  // ES: Los permisos que cada rol tiene.
  rolesPermissions: {
    public: {
      view: true,
      comment: false,
      edit: false,
      delete: false,
      canAssign: [],
      canUnassign: [],
    },
    noPermission: {
      view: false,
      comment: false,
      edit: false,
      delete: false,
      canAssign: [],
      canUnassign: [],
    },
    viewer: {
      view: true,
      comment: false,
      edit: false,
      delete: false,
      canAssign: ['viewer'],
      canUnassign: [],
    },
    commentor: {
      view: true,
      comment: true,
      edit: false,
      delete: false,
      canAssign: ['viewer', 'commentor'],
      canUnassign: ['viewer'],
    },
    editor: {
      view: true,
      comment: true,
      edit: true,
      delete: false,
      canAssign: ['viewer', 'commentor', 'editor'],
      canUnassign: ['viewer', 'commentor'],
    },
    owner: {
      view: true,
      comment: true,
      edit: true,
      delete: true,
      canAssign: ['viewer', 'commentor', 'editor', 'owner'],
      canUnassign: ['viewer', 'commentor', 'editor'],
    },
  },
};
