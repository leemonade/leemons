const parseVersion = require('./parseVersion');

module.exports = function upgradeVersion(version, level) {
  let { major, minor, patch } = parseVersion(version);

  if (level === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  }

  if (level === 'minor') {
    minor += 1;
    patch = 0;
  }

  if (level === 'patch') {
    patch += 1;
  }

  return `${major}.${minor}.${patch}`;
};
