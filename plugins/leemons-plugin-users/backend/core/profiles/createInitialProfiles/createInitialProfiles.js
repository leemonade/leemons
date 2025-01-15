const { SYS_PROFILE_NAMES } = require('../../../config/constants');
const { add } = require('../add');
const { existName } = require('../existName');

const admin = require('./admin.json');
const contentDeveloper = require('./contentDeveloper.json');
const student = require('./student.json');
const teacher = require('./teacher.json');

const INITIAL_PROFILES = [
  { ...admin, sysName: SYS_PROFILE_NAMES.ADMIN },
  { ...teacher, sysName: SYS_PROFILE_NAMES.TEACHER },
  { ...student, sysName: SYS_PROFILE_NAMES.STUDENT },
  { ...contentDeveloper, sysName: SYS_PROFILE_NAMES.CONTENT_DEVELOPER },
];

async function filterProfilesByExistance({ ctx }) {
  const existenceChecks = INITIAL_PROFILES.map((profile) =>
    existName({ name: profile.name, ctx }).then((exists) => ({ profile, exists }))
  );

  const results = await Promise.all(existenceChecks);
  return results.filter(({ exists }) => !exists).map(({ profile }) => profile);
}

async function createInitialProfiles({ ctx }) {
  const profilesToAdd = await filterProfilesByExistance({ ctx });
  await Promise.all(profilesToAdd.map((profile) => add({ ...profile, ctx })));
}

module.exports = { createInitialProfiles };
