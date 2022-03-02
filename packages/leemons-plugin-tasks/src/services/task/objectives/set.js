const addObjectives = require('./add');
const removeObjectives = require('./remove');

module.exports = async function setTags(task, objectives, { transacting } = {}) {
  try {
    await removeObjectives(task, undefined, { transacting });
    return addObjectives(task, objectives, { transacting });
  } catch (e) {
    throw new Error(`Error setting objectives: ${e.message}`);
  }
};
