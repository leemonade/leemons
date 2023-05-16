const _ = require('lodash');
const { map, min, max, find } = require('lodash');
const { table } = require('../tables');

async function getProgramEvaluationSystem(id, { transacting } = {}) {
  const program = await table.programs.findOne({ id }, { transacting });
  if (program.evaluationSystem) {
    const values = await leemons
      .getPlugin('grades')
      .services.evaluations.byIds(program.evaluationSystem, { transacting });
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
