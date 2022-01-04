module.exports = function parsePermissions(permissions) {
  return permissions.split('').map((p) => {
    if (p === 's') {
      return 'share';
    }
    if (p === 'd') {
      return 'delete';
    }
    if (p === 'e') {
      return 'edit';
    }
    if (p === 'v') {
      return 'view';
    }
    throw new Error('Unknown permission');
  });
};
