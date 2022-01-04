module.exports = function stringifyPermissions(permissions) {
  return permissions
    .map((p) => {
      if (p === 'share') {
        return 's';
      }
      if (p === 'delete') {
        return 'd';
      }
      if (p === 'edit') {
        return 'e';
      }
      if (p === 'view') {
        return 'v';
      }
      throw new Error('Unknown permission');
    })
    .join('');
};
