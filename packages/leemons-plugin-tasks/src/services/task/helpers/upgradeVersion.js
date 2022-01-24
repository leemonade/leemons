module.exports = function upgradeVersion(version, level) {
  let [major, minor, patch] = version.split('.');

  if (level === 'major') {
    major = Number(major) + 1;
    minor = 0;
    patch = 0;
  }

  if (level === 'minor') {
    minor = Number(minor) + 1;
    patch = 0;
  }

  if (level === 'patch') {
    patch = Number(patch) + 1;
  }

  return `${major}.${minor}.${patch}`;
};
