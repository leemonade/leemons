/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { validateSaveTest } = require('../../validations/forms');

async function saveTest({ data, ignoreAsset, ctx }) {
  validateSaveTest(data);

  const toSave = {
    asset: {
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      color: data.color,
      cover: data.cover,
      tags: data.tags,
      indexable: true,
      public: true, // TODO Cambiar a false despues de la demo
    },
    role: 'tests',
    subjects: _.map(data.subjects, (subject) => ({
      subject,
      program: data.program,
      curriculum: data.curriculum,
    })),
    statement: data.statement,
    instructionsForTeachers: data.instructionsForTeachers,
    instructionsForStudents: data.instructionsForStudents,
    gradable: data.gradable || false,
    duration: data.duration || '',
    metadata: {
      questionBank: data.questionBank,
      filters: data.filters,
      questions: data.questions,
      type: data.type,
      level: data.level,
      config: data.config,
    },
  };

  if (ignoreAsset) {
    delete toSave.asset;
  }

  let assignable = null;

  if (data.id) {
    delete toSave.role;
    assignable = await ctx.tx.call('assignables.assignables.updateAssignable', {
      assignable: { id: data.id, ...toSave },
      published: data.published,
    });
  } else {
    assignable = await ctx.tx.call('assignables.assignables.createAssignable', {
      assignable: toSave,
      published: data.published,
    });
  }

  return assignable;
}

module.exports = { saveTest };
