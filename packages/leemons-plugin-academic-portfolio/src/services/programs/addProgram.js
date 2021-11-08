const _ = require('lodash');
const { table } = require('../tables');
const { programsByIds } = require('./programsByIds');
const { validateAddProgram, validateSubstagesFormat } = require('../../validations/forms');
const { addSubstage } = require('../substages/addSubstage');

async function addProgram(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      validateAddProgram(data);
      const { centers, substages: _substages, ...programData } = data;
      let substages = _substages;

      // ES: Si se ha marcado que hay substages y usar los valores por defecto generamos los substages
      if (programData.haveSubstagesPerCourse) {
        if (programData.useDefaultSubstagesName) {
          substages = [];
          programData.maxSubstageAbbreviation = 5;
          programData.maxSubstageAbbreviationIsOnlyNumbers = false;
          for (let i = 0, l = programData.numberOfSubstages; i < l; i++) {
            const index = (i + 1).toString().padStart(4, '0');
            substages.push({
              name: `${programData.substagesFrequency[0]}${index}`,
              abbreviation: `${programData.substagesFrequency[0]}${index}`,
            });
          }
        }
        // ES: Comprobamos que los substages tienen el formato correcto
        validateSubstagesFormat(programData, substages);
      }

      const program = await table.programs.create(programData);

      if (_.isArray(substages)) {
        // ES: Generamos los substages
        await Promise.all(
          _.map(substages, (substage) =>
            addSubstage({ ...substage, program: program.id }, { transacting })
          )
        );
      }
      await Promise.all(
        _.map(centers, (center) =>
          table.programCenter.create(
            {
              program: program.id,
              center,
            },
            { transacting }
          )
        )
      );
      return (await programsByIds([program.id], { transacting }))[0];
    },
    table.programCenter,
    _transacting
  );
}

module.exports = { addProgram };
