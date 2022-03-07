const { userInstances } = require('../../table');
const getStudentDetails = require('./get');

const VALID_KEYS = ['opened', 'start', 'end'];

module.exports = async function update({ student, instance, key, value }, { transacting } = {}) {
  if (!VALID_KEYS.includes(key)) {
    throw new Error(`Invalid key: ${key}`);
  }

  // EN: Check if the key is already setted
  // ES: Comprobar si la clave ya está establecida
  const details = await getStudentDetails(student, instance, { columns: [key], transacting });
  if (details[key]) {
    return false;
  }

  // EN: Update the key
  // ES: Actualizar el key
  await userInstances.set(
    { instance, user: student },
    { [key]: global.utils.sqlDatetime(parseInt(value, 10)) },
    { transacting }
  );

  return true;
};
