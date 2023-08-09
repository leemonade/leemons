const _ = require('lodash');
const { programsByIds } = require('./programsByIds');

async function programsByCenters({ centerIds, returnRelation, returnIds, ctx }) {
  // TODO Migration: Cuidado, antes había un userSession optativo como parámetro

  const programCenters = await ctx.tx.db.ProgramCenter.find({
    center: _.isArray(centerIds) ? centerIds : [centerIds],
  }).lean();
  const programIds = _.map(programCenters, 'program');

  // ES: Si returnIds es falso sacamos los programas y se los seteamos a programCenters
  if (!returnIds) {
    const programs = await programsByIds({ ids: programIds, ctx });
    const programsById = _.keyBy(programs, 'id');
    _.forEach(programCenters, (programCenter, index) => {
      programCenters[index].program = programsById[programCenter.program];
    });
  }

  // ES: Si se solicita que solo se devuelva la relacion devolvemos los programCenters
  if (returnRelation) return programCenters;

  // ES: Si se solicita que solo se devuelva las ids las devolvemos
  if (returnIds) return programIds;

  // ES: Si no se especifica nada devolvemos todos los programas
  return _.map(programCenters, 'program');
}

module.exports = { programsByCenters };
