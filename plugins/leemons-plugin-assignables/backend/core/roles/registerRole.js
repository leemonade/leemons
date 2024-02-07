const { pick } = require('lodash');
const { LeemonsError } = require('@leemons/error');
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

function getOrder(order) {
  const assignablesOrder = 200;
  if (order < 100) {
    return assignablesOrder + order;
  }
  if (order) {
    const hundreds = Math.floor(assignablesOrder / 100);
    return assignablesOrder + (order % (hundreds * 100));
  }
  return assignablesOrder + 99;
}

async function registerRole({ role: name, ctx, ...data }) {
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
    // (key === role)
    key: `assignables.${role.name}`,
    ...pick(data, [
      'order',
      'creatable',
      'createUrl',
      'listCardComponent',
      'detailComponent',
      'componentOwner',
      'menu',
      'type',
      'pluralName',
      'singularName',
    ]),
    // provider: data.provider ?? 'leebrary-assignables',
    provider: data.provider ?? 'assignables',
  };
  category.type = category.type || 'activity';

  validateRole(role);

  const roleExists = await checkIfRoleExists({ name, ctx });

  if (roleExists) {
    throw new LeemonsError(ctx, {
      message: `Role "${name}" already exists in assignables`,
      httpStatusCode: 409,
    });
  }

  await ctx.tx.db.Roles.create(role);

  await saveRoleLocalizations({ role: role.name, data, ctx });

  await ctx.tx.call('leebrary.categories.add', {
    data: {
      ...category,
      order: getOrder(category.order),
      creatable: Boolean(category.creatable && category.createUrl),
      duplicable: true,
    },
  });

  return true;
}

module.exports = { registerRole };
