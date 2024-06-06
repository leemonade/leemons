const { pick } = require('lodash');

async function listRoles({ ctx, details }) {
  const query = ctx.tx.db.Roles.find({});

  if (!details) {
    query.select('name');
  }

  const rolesList = await query.lean();

  if (!details) {
    return rolesList.map((role) => role.name);
  }

  return rolesList.map((role) =>
    pick(role, [
      'name',
      'icon',
      'plugin',

      'evaluationDetailUrl',
      'previewUrl',
      'studentDetailUrl',
      'teacherDetailUrl',
    ])
  );
}

module.exports = { listRoles };
