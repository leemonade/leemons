const _ = require('lodash');
const { programsByIds } = require('./programsByIds');
const { validateAddProgram, validateSubstagesFormat } = require('../../validations/forms');
const { addSubstage } = require('../substages/addSubstage');
const { addCourse } = require('../courses/addCourse');
const { addNextCourseIndex } = require('../courses/addNextCourseIndex');
const { addCycle } = require('../cycle/addCycle');
const { addGroup } = require('../groups/addGroup');

async function addProgram({ data, userSession, ctx }) {
  if (!data.maxSubstageAbbreviationIsOnlyNumbers) {
    // eslint-disable-next-line no-param-reassign
    data.maxSubstageAbbreviationIsOnlyNumbers = false;
  }
  if (!data.maxNumberOfCourses) {
    // eslint-disable-next-line no-param-reassign
    data.maxNumberOfCourses = 1;
  }
  validateAddProgram(data);
  const {
    centers,
    image,
    substages: _substages,
    customSubstages,
    names,
    coursesOffset,
    cycles,
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
    validateSubstagesFormat({ programData, substages, ctx });

    if (customSubstages) {
      substages = substages.concat(customSubstages);
    }
  }

  const programDoc = await ctx.tx.db.Programs.create(programData);
  let program = programDoc.toObject();

  // ES: Añadimos el asset de la imagen
  const imageData = {
    indexable: true,
    public: true, // TODO Cambiar a false despues de hacer la demo
    name: program.id,
  };
  if (image) imageData.cover = image;

  const assetImage = await ctx.tx.call('leebrary.assets.add', {
    asset: imageData,
    published: true,
  });

  program = await ctx.tx.db.Programs.findOneAndUpdate(
    { id: program.id },
    {
      image: assetImage.id,
      imageUrl: ctx.tx.call('leebrary.assets.getCoverUrl', { assetId: assetImage.id }),
    },
    { new: true, lean: true }
  );

  if (_.isArray(substages)) {
    // ES: Generamos los substages
    await Promise.all(
      _.map(substages, (substage, index) =>
        addSubstage({ ...substage, program: program.id, index, ctx })
      )
    );
  }

  // ES: Añadimos el programa a los centros
  await Promise.all(
    _.map(centers, (center) =>
      ctx.tx.db.ProgramCenter.create({
        program: program.id,
        center,
      })
    )
  );

  // ES: Creamos los cursos del programa
  const promises = [];

  const coursesNames = names || [];
  const offset = coursesOffset || 0;

  if (data.maxNumberOfCourses >= 2) {
    for (let i = 0, l = data.maxNumberOfCourses; i < l; i++) {
      const courseIndex = i + 1 + offset;

      promises.push(
        addCourse({
          data: {
            program: program.id,
            number: data.courseCredits ? data.courseCredits : 0,
            name: coursesNames[i] || `${courseIndex}`,
          },
          index: courseIndex,
          ctx,
        })
      );
    }
  } else {
    promises.push(
      addCourse({
        data: {
          program: program.id,
          number: data.courseCredits ? data.courseCredits : 0,
          name: coursesNames[0] || `${1 + offset}`,
          isAlone: true,
        },
        index: 1 + offset,
        ctx,
      })
    );
  }

  if (program.useOneStudentGroup) {
    await addGroup({
      data: {
        name: '-auto-',
        abbreviation: '-auto-',
        program: program.id,
        isAlone: true,
      },
      ctx,
    });
  }

  promises.push(
    addNextCourseIndex({
      program: program.id,
      index: data.maxNumberOfCourses + offset,
      ctx,
    })
  );

  await Promise.all(promises);

  const _program = (await programsByIds({ ids: [program.id], ctx }))[0];

  if (cycles?.length && _program.courses?.length) {
    const coursesByIndex = _.keyBy(_program.courses, 'index');
    const cyclePromises = [];
    _.forEach(cycles, (cycle) => {
      const cycleCourses = [];
      _.forEach(cycle.courses, (c) => {
        cycleCourses.push(coursesByIndex[c].id);
      });
      cyclePromises.push(
        addCycle({
          data: {
            ...cycle,
            program: _program.id,
            courses: cycleCourses,
          },
          ctx,
        })
      );
    });
    await Promise.all(cyclePromises);
  }

  await ctx.tx.emit('after-add-program', {
    program: _program,
    userSession,
  });

  await Promise.all([
    ctx.tx.call('menu-builder.menuItem.enable', { key: ctx.prefixPN('programs') }),
    ctx.tx.call('menu-builder.menuItem.enable', { key: ctx.prefixPN('subjects') }),
  ]);
  return _program;
}

module.exports = { addProgram };
