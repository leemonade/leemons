const addObjectives = require('./add');
const removeObjectives = require('./remove');

module.exports = async function setTags(task, subject, objectives, { transacting } = {}) {
  try {
    await removeObjectives(task, subject, undefined, { transacting });
    return addObjectives(task, subject, objectives, { transacting });
  } catch (e) {
    throw new Error(`Error setting objectives: ${e.message}`);
  }
};
