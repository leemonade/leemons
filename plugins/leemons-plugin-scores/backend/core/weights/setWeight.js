const { validateWeight } = require('../../validation/validateWeight');

async function setWeight({ weight, ctx }) {
  // TODO: @MIGUELez11 Check if the user has access to the class

  validateWeight({ weight, ctx });

  await ctx.tx.db.Weights.deleteOne({ class: weight.class });

  return ctx.tx.db.Weights.create(weight);
}

module.exports = setWeight;
