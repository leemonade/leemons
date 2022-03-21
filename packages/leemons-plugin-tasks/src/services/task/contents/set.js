const addContents = require('./add');
const removeContents = require('./remove');

module.exports = async function setContents(task, contents, { transacting } = {}) {
  try {
    await removeContents(task, undefined, { transacting });
    return addContents(task, contents, { transacting });
  } catch (e) {
    throw new Error(`Error setting contents: ${e.message}`);
  }
};
