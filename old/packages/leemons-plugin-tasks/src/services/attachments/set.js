const addAttachments = require('./add');
const removeAttachments = require('./remove');

module.exports = async function setAttachments(task, attachments, { transacting } = {}) {
  try {
    await removeAttachments(task, undefined, { transacting });
    return addAttachments(task, attachments, { transacting });
  } catch (e) {
    throw new Error(`Error setting attachments: ${e.message}`);
  }
};
