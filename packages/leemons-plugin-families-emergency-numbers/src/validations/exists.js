const { existMember } = require('../services/family-members/existMember');

async function validateExistMemberInFamily(family, user, { transacting } = {}) {
  if (await existMember(family, user, { transacting }))
    throw new Error(`User '${user}' already exists in family '${family}'`);
}

async function validateNotExistMemberInFamily(family, user, { transacting } = {}) {
  if (!(await existMember(family, user, { transacting })))
    throw new Error(`User '${user}' not exists in family '${family}'`);
}

module.exports = {
  validateExistMemberInFamily,
  validateNotExistMemberInFamily,
};
