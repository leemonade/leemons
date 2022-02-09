module.exports = function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map((v) => Number(v) || 0);

  return { major, minor, patch };
};
