module.exports = {
  // EN: The roles must be ordered by allowance. Each role can only assign lower roles.
  // ES: Los roles deben estar ordenados por permisos. Cada rol sólo puede asignar roles inferiores.
  roles: ['noPermission', 'viewer', 'commentor', 'editor', 'owner'],

  // EN: The permissions each role has.
  // ES: Los permisos que cada rol tiene.
  rolesPermissions: {
    noPermission: {
      view: false,
      comment: false,
      edit: false,
      delete: false,
    },
    viewer: {
      view: true,
      comment: false,
      edit: false,
      delete: false,
    },
    commentor: {
      view: true,
      comment: true,
      edit: false,
      delete: false,
    },
    editor: {
      view: true,
      comment: true,
      edit: true,
      delete: false,
    },
    owner: {
      view: true,
      comment: true,
      edit: true,
      delete: true,
    },
  },
};
