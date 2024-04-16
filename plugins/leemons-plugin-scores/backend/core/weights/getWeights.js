const { LeemonsError } = require('@leemons/error');
const { isArray, pick } = require('lodash');

const WEIGHT_COMMON_PROPS = ['id', 'class', 'type'];
const ROLES_PROPS = [...WEIGHT_COMMON_PROPS, 'weights', 'applySameValue', 'explanation'];
const MODULES_PROPS = ROLES_PROPS;

async function getWeights({ classes: _classes, ctx }) {
  // TODO: @MIGUELez11 Check if the user has access to the classes

  const classes = isArray(_classes) ? _classes : [_classes];

  const weights = await ctx.tx.db.Weights.find({ class: classes });

  return weights.map((weight) => {
    if (weight.type === 'averages') {
      return pick(weight, WEIGHT_COMMON_PROPS);
    }

    if (weight.type === 'roles') {
      return pick(weight, ROLES_PROPS);
    }

    if (weight.type === 'modules') {
      return pick(weight, MODULES_PROPS);
    }

    throw new LeemonsError(ctx, { message: 'Invalid weight type', httpStatusCode: 500 });
  });
}

module.exports = getWeights;
