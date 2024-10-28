const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

const { validateAddProgram, validateSubstagesFormat } = require('../../validations/forms');
const { addCourse } = require('../courses/addCourse');
const { addNextCourseIndex } = require('../courses/addNextCourseIndex');
const { addCycle } = require('../cycle/addCycle');
const { addNextGroupIndex } = require('../groups');
const { addGroup } = require('../groups/addGroup');
const { addSubstage } = require('../substages/addSubstage');

const { programsByIds } = require('./programsByIds');
const { setProgramStaff } = require('./setProgramStaff');

function getReferenceGroupsNames(
  format,
  groupsAmount,
  digits,
  customNameFormat,
  ctx,
  prefixWhenCustom = ''
) {
  // Validate the format to ensure it's one of the allowed values
  if (format !== 'alphabetical' && format !== 'numerical' && format !== 'custom') {
    throw new LeemonsError(ctx, { message: 'Invalid format name in Reference Groups creation.' });
  }
  const names = [];
  if (format === 'alphabetical') {
    for (let i = 0; i < groupsAmount; i++) {
      const letter = String.fromCharCode(65 + (i % 26));
      const repeats = Math.floor(i / 26);
      names.push(`${prefixWhenCustom}${'A'.repeat(repeats)}${letter}`);
    }
  } else if (format === 'numerical') {
    for (let i = 1; i <= groupsAmount; i++) {
      names.push(`${prefixWhenCustom}${i.toString().padStart(digits, '0')}`);
    }
  } else if (format === 'custom') {
    // Ensure it's safe for the function to call itself
    if (customNameFormat !== 'alphabetical' && customNameFormat !== 'numerical') {
      throw new LeemonsError(ctx, {
        message: 'Invalid custom name format in Reference Groups creation.',
      });
    }
    return getReferenceGroupsNames(
      customNameFormat,
      groupsAmount,
      digits,
      '',
      ctx,
      prefixWhenCustom
    );
  }

  return names;
}

async function handleReferenceGroups(programData, program, ctx) {
  const promises = [];
  const { nameFormat, digits, customNameFormat, prefix, ...groupsPerCourse } =
    programData.referenceGroups;
  let index = 0;

  // Groups for all courses handles the case when a program with non-sequential courses uses reference groups
  // In these cases, all courses will have the same amount of reference groups
  if (groupsPerCourse.groupsForAllCourses) {
    const groupsNames = getReferenceGroupsNames(
      nameFormat,
      groupsPerCourse.groupsForAllCourses,
      digits,
      customNameFormat,
      ctx,
      prefix || ''
    );
    for (let i = 0; i < groupsPerCourse.groupsForAllCourses; i++) {
      index++;
      promises.push(
        addGroup({
          data: {
            name: groupsNames[i],
            abbreviation: groupsNames[i],
            program: program.id,
          },
          index,
          ctx,
        })
      );
    }
    promises.push(addNextGroupIndex({ program: program.id, index, ctx }));
  } else {
    Object.keys(groupsPerCourse).forEach((key) => {
      const groupsAmount = groupsPerCourse[key];
      const groupsCourse = parseInt(key.replace('groupsForCourse', ''));
      const groupsNames = getReferenceGroupsNames(
        nameFormat,
        groupsAmount,
        digits,
        customNameFormat,
        ctx,
        prefix || ''
      );
      for (let i = 0; i < groupsAmount; i++) {
        index++;
        promises.push(
          addGroup({
            data: {
              name: groupsNames[i],
              abbreviation: groupsNames[i],
              program: program.id,
              metadata: {
                course: groupsCourse,
              },
            },
            index,
            ctx,
          })
        );
      }
    });
    promises.push(addNextGroupIndex({ program: program.id, index, ctx }));
  }

  await Promise.all(promises);
}

async function addProgram({ data, userSession, ctx }) {
  if (!data.maxSubstageAbbreviationIsOnlyNumbers) {
    // eslint-disable-next-line no-param-reassign
    data.maxSubstageAbbreviationIsOnlyNumbers = false;
  }
  if (!data.maxNumberOfCourses) {
    // eslint-disable-next-line no-param-reassign
    data.maxNumberOfCourses = 1;
  }
  validateAddProgram(data, ctx);
  const {
    centers,
    image,
    substages: _substages,
    customSubstages,
    coursesName, // Maybe needed in the future to set a custom course name for ALL courses. Not set to be stored in DB
    coursesOffset,
    cycles,
    ...programData
  } = data;

  let substages = _substages;

  // *Legacy functionality to set substages individually per course, allowing use of default or custom nomenclature
  if (programData.hasSubstagesPerCourse) {
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
    indexable: false,
    public: true,
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
      imageUrl: await ctx.tx.call('leebrary.assets.getCoverUrl', { assetId: assetImage.id }),
    },
    { new: true, lean: true }
  );

  // ES: Creamos las substages
  if (_.isArray(substages)) {
    await Promise.all(
      _.map(substages, (substage, index) =>
        addSubstage({ ...substage, program: program.id, index: index + 1, ctx })
      )
    );
  }

  // ES: Añadimos la relación programa-centro
  await Promise.all(
    _.map(centers, (center) =>
      ctx.tx.db.ProgramCenter.create({
        program: program.id,
        center,
      })
    )
  );

  const coursesAndGroupsPromises = [];

  const offset = coursesOffset || 0;
  if (programData.courses?.length) {
    programData.courses?.forEach(({ index, minCredits, maxCredits, seats }) => {
      const courseIndex = index + offset;

      coursesAndGroupsPromises.push(
        addCourse({
          data: {
            program: program.id,
            // number: data.courseCredits ? data.courseCredits : 0,
            name: coursesName ? `${coursesName} ${courseIndex}` : `${courseIndex}º`,
            metadata: { minCredits, maxCredits, seats },
          },
          index: courseIndex,
          ctx,
        })
      );
    });
  } else {
    // For programs created in free tier: One course, no credits
    coursesAndGroupsPromises.push(
      addCourse({
        data: {
          program: program.id,
          // number: programData.credits || 0,
          name: coursesName ? `${coursesName} ${1 + offset}` : `${1 + offset}º`,
          metadata: { minCredits: null, maxCredits: null },
          isAlone: true,
        },
        index: 1 + offset,
        ctx,
      })
    );
  }

  coursesAndGroupsPromises.push(
    addNextCourseIndex({
      program: program.id,
      index: programData.courses?.length || 1 + offset,
      ctx,
    })
  );

  if (!_.isEmpty(programData.referenceGroups)) {
    await handleReferenceGroups(programData, program, ctx);
    // Store the groups setup and inital data in case of need later while updating (not the case currently)
    program = await ctx.tx.db.Programs.findOneAndUpdate(
      { id: program.id },
      {
        groupsMetadata: { ...programData.referenceGroups },
      },
      { new: true, lean: true }
    );
  }

  await Promise.all(coursesAndGroupsPromises);

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

  if (programData.staff) {
    await setProgramStaff({
      programId: _program.id,
      staff: programData.staff,
      ctx,
    });
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

module.exports = { addProgram, handleReferenceGroups };
