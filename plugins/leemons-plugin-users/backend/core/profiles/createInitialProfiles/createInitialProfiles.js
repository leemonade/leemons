/* eslint-disable global-require */
const admin = require('./admin.json');
const teacher = require('./teacher.json');
const student = require('./student.json');
const { add } = require('../add');
const { SYS_PROFILE_NAMES } = require('../../../config/constants');

async function createInitialProfiles({ ctx }) {
  const n = await ctx.tx.db.Profiles.countDocuments({});
  if (n < 3) {
    await Promise.all([
      add({ ...admin, sysName: SYS_PROFILE_NAMES.ADMIN, ctx }),
      add({ ...teacher, sysName: SYS_PROFILE_NAMES.TEACHER, ctx }),
      add({ ...student, sysName: SYS_PROFILE_NAMES.STUDENT, ctx }),
    ]);
  }
}

module.exports = { createInitialProfiles };
