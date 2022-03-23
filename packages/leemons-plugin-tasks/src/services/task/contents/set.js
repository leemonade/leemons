const addContents = require('./add');
const removeContents = require('./remove');

module.exports = async function setContents(task, subject, contents, { transacting } = {}) {
  try {
    await removeContents(task, subject, undefined, { transacting });
    return addContents(task, subject, contents, { transacting });
  } catch (e) {
    throw new Error(`Error setting contents: ${e.message}`);
  }
};
