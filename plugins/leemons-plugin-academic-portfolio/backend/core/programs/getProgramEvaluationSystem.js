const _ = require('lodash');
const { find } = require('lodash');

async function getProgramEvaluationSystem({ id, ctx }) {
  const program = await ctx.tx.db.Programs.findOne({ id }).lean();
  if (program.evaluationSystem) {
    const values = await ctx.tx.call('grades.evaluations.byIds', {
      ids: program.evaluationSystem,
    });

    const evaluationSystem = values[0];
    const scaleNumbers = _.map(evaluationSystem.scales, 'number');
    const minNumber = _.min(scaleNumbers);
    const maxNumber = _.max(scaleNumbers);
    evaluationSystem.minScale = find(evaluationSystem.scales, { number: minNumber });
    evaluationSystem.maxScale = find(evaluationSystem.scales, { number: maxNumber });
    evaluationSystem.minScaleToPromote = find(evaluationSystem.scales, {
      id: evaluationSystem.minScaleToPromote,
    });
    return evaluationSystem;
  }
  throw new Error('This program dont have evaluation system');
}

module.exports = { getProgramEvaluationSystem };
