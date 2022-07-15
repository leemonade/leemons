const admin = require('./admin.json');
const teacher = require('./teacher.json');
const student = require('./student.json');

async function createInitialProfiles({ transacting: _transacting } = {}) {
  const { table } = require('../../tables');
  const { add } = require('../add');
  return global.utils.withTransaction(
    async (transacting) => {
      const n = await table.profiles.count({}, { transacting });
      if (n < 3) {
        await Promise.all([
          add(admin, { transacting, sysName: 'admin' }),
          add(teacher, { transacting, sysName: 'teacher' }),
          add(student, { transacting, sysName: 'student' }),
        ]);
      }
    },
    table.profiles,
    _transacting
  );
}

module.exports = { createInitialProfiles };
