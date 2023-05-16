module.exports = function stringifyVersion({ major, minor, patch } = {}) {
  if (typeof major !== 'number' || typeof minor !== 'number' || typeof patch !== 'number') {
    throw new Error('Version must be an object with major, minor, and patch numeric properties');
  }

  if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
    throw new Error(
      'Version must be an object with major, minor, and patch numeric non-NaN properties'
    );
  }

  return `${major}.${minor}.${patch}`;
};
