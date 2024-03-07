const { LeemonsError } = require('@leemons/error');
const { existMember } = require('../core/family-members/existMember');

async function validateExistMemberInFamily({ family, user, ctx }) {
  if (await existMember({ family, user, ctx }))
    throw new LeemonsError(ctx, { message: `User '${user}' already exists in family '${family}'` });
}

async function validateNotExistMemberInFamily({ family, user, ctx }) {
  if (!(await existMember({ family, user, ctx })))
    throw new LeemonsError(ctx, { message: `User '${user}' not exists in family '${family}'` });
}

module.exports = {
  validateExistMemberInFamily,
  validateNotExistMemberInFamily,
};
