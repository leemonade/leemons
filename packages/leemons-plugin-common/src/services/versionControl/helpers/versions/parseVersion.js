module.exports = function parseVersion(version) {
  if (typeof version !== 'string') {
    throw new Error('Version must be a string');
  }

  const [major, minor, patch] = version.split('.').map(Number);

  if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
    throw new Error('Version must be a string of numbers separated by dots');
  }

  return { major, minor, patch };
};
