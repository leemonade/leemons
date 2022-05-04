/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { validateSaveTest } = require('../../validations/forms');

async function saveTest(data, { userSession, transacting: _transacting } = {}) {
  // const tagsService = leemons.getPlugin('common').services.tags;
  // const versionControlService = leemons.getPlugin('common').services.versionControl;
  return global.utils.withTransaction(
    async (transacting) => {
      validateSaveTest(data);
      const { assignables: assignableService } = leemons.getPlugin('assignables').services;

      const toSave = {
        asset: {
          name: data.name,
          description: data.description,
          color: data.color,
          cover: data.cover,
          tags: data.tags,
          indexable: true,
          public: true, // TODO Cambiar a false despues de la demo
        },
        role: 'tests',
        program: data.program,
        subjects: _.map(data.subjects, (subject) => ({ subject, program: data.program })),
        statement: data.statement,
        instructionsForTeachers: data.instructionsForTeachers,
        instructionsForStudents: data.instructionsForStudents,
        gradable: data.gradable || false,
        metadata: {
          questionBank: data.questionBank,
          filters: data.filters,
          questions: data.questions,
          type: data.type,
          level: data.level,
        },
      };

      if (data.id) {
        delete toSave.role;
        console.log(data);
        return assignableService.updateAssignable(
          { id: data.id, ...toSave },
          {
            userSession,
            transacting,
            published: data.published,
          }
        );
      }
      return assignableService.createAssignable(toSave, {
        userSession,
        transacting,
        published: data.published,
      });

      /*
      const { id, questions, tags, published, ...props } = data;
      let test;

      if (id) {
        let version = await versionControlService.getVersion(id, { transacting });
        if (version.published) {
          version = await versionControlService.upgradeVersion(id, 'major', {
            published,
            setAsCurrent: true,
            transacting,
          });
          test = await table.tests.create(
            {
              id: version.fullId,
              ...props,
              filters: JSON.stringify(props.filters),
            },
            { transacting }
          );
        } else {
          if (published) {
            await versionControlService.publishVersion(id, true, { transacting });
          }
          test = await table.tests.update(
            { id },
            {
              ...props,
              filters: JSON.stringify(props.filters),
            },
            { transacting }
          );
        }
      } else {
        const version = await versionControlService.register('test', {
          published,
          transacting,
        });
        test = await table.tests.create(
          {
            id: version.fullId,
            ...props,
            filters: JSON.stringify(props.filters),
          },
          { transacting }
        );
      }

      await tagsService.setTagsToValues('plugins.tests.tests', tags || [], test.id, {
        transacting,
      });

      await removeTestQuestions(test.id, { transacting });
      if (questions && questions.length) {
        await addQuestionToTest(test.id, questions, { transacting });
      }

      return test;

       */
    },
    table.questionsBanks,
    _transacting
  );
}

module.exports = { saveTest };
