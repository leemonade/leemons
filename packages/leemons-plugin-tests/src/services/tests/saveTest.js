/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { validateSaveTest } = require('../../validations/forms');
const { removeTestQuestions } = require('./removeTestQuestions');
const { addQuestionToTest } = require('./addQuestionToTest');

async function saveTest(_data, { transacting: _transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const versionControlService = leemons.getPlugin('common').services.versionControl;
  return global.utils.withTransaction(
    async (transacting) => {
      const data = _.cloneDeep(_data);
      validateSaveTest(data);
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
    },
    table.questionsBanks,
    _transacting
  );
}

module.exports = { saveTest };
