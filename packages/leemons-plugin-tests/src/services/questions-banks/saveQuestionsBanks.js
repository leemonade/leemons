const _ = require('lodash');
const { table } = require('../tables');
const { validateSaveQuestionBank } = require('../../validations/forms');
const { updateQuestion } = require('../questions/updateQuestion');
const { createQuestion } = require('../questions/createQuestion');

async function saveQuestionsBanks(data, { transacting: _transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  return global.utils.withTransaction(
    async (transacting) => {
      validateSaveQuestionBank(data);
      const { id, questions, tags, ...props } = data;
      let questionBank;
      if (id) {
        questionBank = await table.questionsBanks.update({ id }, props, { transacting });
      } else {
        questionBank = await table.questionsBanks.create(props, { transacting });
      }
      await tagsService.setTagsToValues('plugins.tests.questionBanks', tags, questionBank.id, {
        transacting,
      });

      const currentQuestions = await table.questions.find(
        { questionBank: questionBank.id },
        {
          columns: ['id'],
          transacting,
        }
      );
      const currentQuestionsIds = _.map(currentQuestions, 'id');
      const questionsToCreate = [];
      const questionsToUpdate = [];
      const questionsToDelete = [];
      _.forEach(questions, (question) => {
        if (question.id) {
          if (currentQuestionsIds.includes(question.id)) {
            questionsToUpdate.push(question);
          } else {
            questionsToCreate.push(question);
          }
        } else {
          questionsToCreate.push(question);
        }
      });
      _.forEach(currentQuestionsIds, (questionId) => {
        if (!_.find(questions, { id: questionId })) {
          questionsToDelete.push(questionId);
        }
      });
      if (questionsToDelete.length) {
        await table.questions.removeMany({ id_$in: questionsToDelete }, { transacting });
      }
      if (questionsToUpdate.length) {
        await Promise.all(
          _.map(questionsToUpdate, (question) => updateQuestion(question, { transacting }))
        );
      }
      if (questionsToCreate.length) {
        await Promise.all(
          _.map(questionsToCreate, (question) =>
            createQuestion({ ...question, questionBank: questionBank.id }, { transacting })
          )
        );
      }
      return questionBank;
    },
    table.questionsBanks,
    _transacting
  );
}

module.exports = { saveQuestionsBanks };
