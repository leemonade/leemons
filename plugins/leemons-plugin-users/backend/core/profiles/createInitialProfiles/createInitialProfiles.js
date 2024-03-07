/* eslint-disable global-require */
const admin = require('./admin.json');
const teacher = require('./teacher.json');
const student = require('./student.json');
const { add } = require('../add');

async function createInitialProfiles({ ctx }) {
  const n = await ctx.tx.db.Profiles.countDocuments({});
  if (n < 3) {
    await Promise.all([
      add({ ...admin, sysName: 'admin', ctx }),
      add({ ...teacher, sysName: 'teacher', ctx }),
      add({ ...student, sysName: 'student', ctx }),
    ]);
  }
}

module.exports = { createInitialProfiles };
