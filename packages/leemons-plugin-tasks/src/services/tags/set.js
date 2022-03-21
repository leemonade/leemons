const addTags = require('./add');
const removeTags = require('./remove');

module.exports = async function setTags(task, tags, { transacting } = {}) {
  try {
    await removeTags(task, undefined, { transacting });
    return addTags(task, tags, { transacting });
  } catch (e) {
    throw new Error(`Error setting tags: ${e.message}`);
  }
};
