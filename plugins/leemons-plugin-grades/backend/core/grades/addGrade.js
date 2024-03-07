const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { validateAddGrade } = require('../../validations/forms');
const { addGradeScale } = require('../grade-scales');
const { gradeByIds } = require('./gradeByIds');

async function addGrade({ data, fromFrontend, ctx }) {
  await validateAddGrade({ data, disableRequired: fromFrontend });

  const { scales, minScaleToPromote, ..._data } = data;

  let grade = await ctx.tx.db.Grades.create(_data);
  grade = grade.toObject();

  if (!fromFrontend) {
    const newScales = await Promise.all(
      _.map(scales, (scale) => addGradeScale({ data: { ...scale, grade: grade.id }, ctx }))
    );

    const minScale = _.find(newScales, { number: minScaleToPromote });
    if (!minScale)
      throw new LeemonsError(ctx, { message: 'minScaleToPromote not found inside scales' });

    await ctx.tx.db.Grades.updateOne({ id: grade.id }, { minScaleToPromote: minScale.id });
  }
  await Promise.allSettled([
    ctx.tx.call('menu-builder.menuItem.enable', { key: ctx.prefixPN('evaluations') }),
    ctx.tx.call('menu-builder.menuItem.enable', { key: ctx.prefixPN('promotions') }),
  ]);
  return (await gradeByIds({ ids: grade.id, ctx }))[0];
}

module.exports = { addGrade };
