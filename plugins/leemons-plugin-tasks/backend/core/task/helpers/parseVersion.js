module.exports = function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number);

  if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
    throw new Error(`Invalid version: ${version}`);
  }

  return { major, minor, patch };
};
