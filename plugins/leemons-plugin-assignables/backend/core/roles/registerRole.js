const { pick } = require('lodash');
const { validateRole } = require('../../validations/validateRole');
const { getRole } = require('./getRole');

async function checkIfRoleExists({ name, ctx }) {
  try {
    await getRole({ role: name, ctx });

    return true;
  } catch (e) {
    return false;
  }
}

async function saveRoleLocalizations({ role, data, ctx }) {
  const plural = data.pluralName;
  const singular = data.singularName;

  return Promise.all([
    ctx.tx.call('multilanguage.common.addManyByKey', {
      key: ctx.prefixPN(`roles.${role}.plural`),
      data: plural,
    }),
    ctx.tx.call('multilanguage.common.addManyByKey', {
      key: ctx.prefixPN(`roles.${role}.singular`),
      data: singular,
    }),
  ]);
}

async function registerRole({ name, ctx, ...data }) {
  const role = {
    name,
    teacherDetailUrl: data.teacherDetailUrl,
    studentDetailUrl: data.studentDetailUrl,
    evaluationDetailUrl: data.evaluationDetailUrl,
    dashboardUrl: data.dashboardUrl,
    previewUrl: data.previewUrl,
    plugin: ctx.callerPlugin,
    icon: data.menu.item.iconSvg,
  };

  const category = {
    role: `assignables.${role.name}`,
    ...pick(data, [
      'order',
      'creatable',
      'createUrl',
      'listCardComponent',
      'detailComponent',
      'componentOwner',
      'menu',
    ]),
    provider: data.provider ?? 'leebrary-assignables',
  };

  validateRole(role);

  const roleExists = await checkIfRoleExists({ name, ctx });

  if (roleExists) {
    throw new Error(`Role "${name}" already exists in assignables`);
  }

  await ctx.tx.db.Roles.create(role);

  await saveRoleLocalizations({ role: role.name, data, ctx });

  await ctx.tx.call('leebrary.categories.add', category);

  return true;
}

module.exports = { registerRole };
