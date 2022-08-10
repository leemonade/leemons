const _ = require('lodash');
const { table } = require('../tables');
const { programsByIds } = require('./programsByIds');
const { validateAddProgram, validateSubstagesFormat } = require('../../validations/forms');
const { addSubstage } = require('../substages/addSubstage');
const { addCourse } = require('../courses/addCourse');
const { addNextCourseIndex } = require('../courses/addNextCourseIndex');
const enableMenuItemService = require('../menu-builder/enableItem');

async function addProgram(data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      if (!data.maxSubstageAbbreviationIsOnlyNumbers) {
        // eslint-disable-next-line no-param-reassign
        data.maxSubstageAbbreviationIsOnlyNumbers = false;
      }
      validateAddProgram(data);
      const {
        centers,
        image,
        substages: _substages,
        customSubstages,
        names,
        coursesOffset,
        ...programData
      } = data;
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

        if (customSubstages) {
          substages = substages.concat(customSubstages);
        }
      }

      let program = await table.programs.create(programData, { transacting });

      // ES: Añadimos el asset de la imagen
      const imageData = {
        indexable: true,
        public: true, // TODO Cambiar a false despues de hacer la demo
        name: program.id,
      };
      if (image) imageData.cover = image;
      const assetService = leemons.getPlugin('leebrary').services.assets;
      const assetImage = await assetService.add(imageData, {
        published: true,
        userSession,
        transacting,
      });
      program = await table.programs.update(
        { id: program.id },
        {
          image: assetImage.id,
          imageUrl: assetService.getCoverUrl(assetImage.id),
        },
        { transacting }
      );

      if (_.isArray(substages)) {
        // ES: Generamos los substages
        await Promise.all(
          _.map(substages, (substage) =>
            addSubstage({ ...substage, program: program.id }, { transacting })
          )
        );
      }

      // ES: Añadimos el programa a los centros
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

      // ES: Creamos los cursos del programa
      const promises = [];

      const coursesNames = names || [];
      const offset = coursesOffset || 0;

      if (data.maxNumberOfCourses) {
        for (let i = 0, l = data.maxNumberOfCourses; i < l; i++) {
          const courseIndex = i + 1 + offset;

          promises.push(
            addCourse(
              {
                program: program.id,
                number: data.courseCredits ? data.courseCredits : 0,
                name: coursesNames[i] || `${courseIndex}`,
              },
              { index: courseIndex, transacting }
            )
          );
        }
      } else {
        promises.push(
          addCourse(
            {
              program: program.id,
              number: data.courseCredits ? data.courseCredits : 0,
              name: coursesNames[0] || `${1 + offset}`,
            },
            { index: 1 + offset, transacting }
          )
        );
      }

      promises.push(
        addNextCourseIndex(program.id, { index: data.maxNumberOfCourses + offset, transacting })
      );

      await Promise.all(promises);

      const _program = (await programsByIds([program.id], { userSession, transacting }))[0];
      await leemons.events.emit('after-add-program', {
        program: _program,
        transacting,
        userSession,
      });
      await Promise.all([enableMenuItemService('programs'), enableMenuItemService('subjects')]);
      return _program;
    },
    table.programCenter,
    _transacting
  );
}

module.exports = { addProgram };
