const _ = require('lodash');

async function getProgramStaffMany({ ids, ctx }) {
  const normalizedIds = Array.isArray(ids) ? ids : [ids];
  return ctx.tx.db.ProgramStaff.find({ program: { $in: normalizedIds } });
}

async function getProgramStaff({ programId, ctx, organizeByRoles = false }) {
  const staff = await ctx.tx.db.ProgramStaff.find({ program: programId });
  return organizeByRoles ? organizeProgramStaffByRoles(staff) : staff;
}

const organizeProgramStaffByRoles = (programStaff) =>
  programStaff?.reduce(
    (acc, { role, userAgent }) => ({
      ...acc,
      [role]: userAgent,
    }),
    {}
  ) || {};

module.exports = { getProgramStaff, getProgramStaffMany, organizeProgramStaffByRoles };
