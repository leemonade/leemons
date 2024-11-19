const { keyBy, isEmpty } = require('lodash');

const { validateUpdateProgramConfiguration } = require('../../validations/forms');
const { addCourse } = require('../courses/addCourse');
const { addNextCourseIndex } = require('../courses/addNextCourseIndex');
const { addCycle } = require('../cycle/addCycle');
const { saveManagers } = require('../managers/saveManagers');
const { addSubstage } = require('../substages/addSubstage');

const { handleReferenceGroups } = require('./addProgram');
const { programsByIds } = require('./programsByIds');
const { setProgramStaff } = require('./setProgramStaff');

async function updateBasicData({ data, ctx }) {
  const { id, image, managers, ...programData } = data;

  let [program] = await Promise.all([
    ctx.tx.db.Programs.findOneAndUpdate({ id }, programData, { new: true, lean: true }),
    saveManagers({ userAgents: managers, type: 'program', relationship: id, ctx }),
  ]);

  const imageData = {
    indexable: false,
    public: true,
    name: program.id,
  };
  if (image) imageData.cover = image;

  const assetImage = await ctx.tx.call('leebrary.assets.update', {
    data: { id: program.image, ...imageData },
    published: true,
  });

  program = await ctx.tx.db.Programs.findOneAndUpdate(
    { id: program.id },
    {
      image: assetImage.id,
      imageUrl: await ctx.tx.call('leebrary.assets.getCoverUrl', { assetId: assetImage.id }),
    },
    {
      new: true,
      lean: true,
    }
  );

  return (await programsByIds({ ids: [program.id], ctx }))[0];
}

async function updateProgramConfiguration({ data, ctx }) {
  validateUpdateProgramConfiguration(data);
  const {
    substages,
    substagesToRemove,
    cycles,
    courses,
    referenceGroups,
    staff,
    ...basicDataAndManagers
  } = data;

  // BASIC DATA ·············································································||

  let program = await updateBasicData({ data: { ...basicDataAndManagers }, ctx });

  // MANAGE SUBSTAGES ·············································································||

  if (substagesToRemove?.length) {
    await ctx.tx.db.Groups.deleteMany({ id: substagesToRemove.map((item) => item.id) });
  }
  const substageCreationAndUpdates = [];
  substages.forEach(({ id, name, abbreviation, index }) => {
    if (id) {
      substageCreationAndUpdates.push(
        ctx.tx.db.Groups.findOneAndUpdate(
          { id },
          { name, abbreviation, index },
          { new: true, upsert: true, lean: true }
        )
      );
    } else {
      substageCreationAndUpdates.push(
        addSubstage({ name, abbreviation, index, program: program.id, type: 'substage', ctx })
      );
    }
  });
  await Promise.all(substageCreationAndUpdates);

  // MANAGE COURSES ·············································································||

  if (courses?.length) {
    const oldCourses = program.courses.map((item) => item.id);
    await ctx.tx.db.Groups.deleteMany({ id: oldCourses });
    const coursesPromises = [];
    courses?.forEach(({ index, minCredits, maxCredits, seats }) => {
      coursesPromises.push(
        addCourse({
          data: {
            program: program.id,
            name: `${data.coursesName} ${index}`,
            metadata: { minCredits, maxCredits, seats },
          },
          index,
          ctx,
        })
      );
    });

    coursesPromises.push(
      addNextCourseIndex({
        program: program.id,
        index: program.courses?.length,
        ctx,
      })
    );
    await Promise.all(coursesPromises);
  }

  // MANAGE STAFF ·············································································||
  if (staff) {
    await setProgramStaff({
      programId: program.id,
      staff,
      ctx,
    });
  }

  const _program = (await programsByIds({ ids: [program.id], ctx }))[0];

  // MANAGE REFERENCE GROUPS ···································································||

  if (!isEmpty(referenceGroups)) {
    const oldReferenceGroups = program.groups.map((item) => item.id);
    await ctx.tx.db.Groups.deleteMany({ id: oldReferenceGroups });
    await handleReferenceGroups(data, program, ctx);

    // Store the groups setup and inital data in case of need later while updating (not the case currently)
    program = await ctx.tx.db.Programs.findOneAndUpdate(
      { id: program.id },
      {
        groupsMetadata: { ...referenceGroups },
      },
      { new: true, lean: true }
    );
  }

  // MANAGE CYCLES ·············································································||
  const oldCycles = await ctx.tx.db.Cycles.find({ program: program.id }).lean();
  await ctx.tx.db.Cycles.deleteMany({ id: oldCycles.map((item) => item.id) });

  if (_program.courses?.length && cycles?.length) {
    const coursesByIndex = keyBy(_program.courses, 'index');
    const cyclePromises = [];
    cycles.forEach((cycle) => {
      const courseIds = cycle.courses.map((courseIndex) => coursesByIndex[courseIndex].id);

      cyclePromises.push(
        addCycle({
          data: {
            ...cycle,
            program: program.id,
            courses: courseIds,
          },
          ctx,
        })
      );
    });

    await Promise.all(cyclePromises);
  }

  await ctx.tx.emit('after-update-program', { program: _program });
  return _program;
}

module.exports = { updateProgramConfiguration };
