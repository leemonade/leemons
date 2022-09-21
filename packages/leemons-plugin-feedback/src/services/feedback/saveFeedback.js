/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { validateSaveFeedback } = require('../../validations/forms');
const { updateFeedbackQuestion } = require('../feedback-questions/updateFeedbackQuestion');
const { createFeedbackQuestion } = require('../feedback-questions/createFeedbackQuestion');
const { deleteFeedbackQuestions } = require('../feedback-questions/deleteFeedbackQuestions');

async function saveFeedback(_data, { userSession, transacting: _transacting } = {}) {
  const versionControlService = leemons.getPlugin('common').services.versionControl;
  return global.utils.withTransaction(
    async (transacting) => {
      const data = _.cloneDeep(_data);
      delete data.asset;
      _.forEach(data.questions, (question) => {
        delete question.questionBank;
        delete question.deleted;
        delete question.created_at;
        delete question.updated_at;
        delete question.deleted_at;
      });
      // Check is userSession is provided
      if (!userSession) throw new Error('User session is required (saveFeedback)');
      validateSaveFeedback(data);
      const { id, questions, tags, published, ...props } = data;
      let feedback;

      if (id) {
        let version = await versionControlService.getVersion(id, { transacting });

        if (version.published) {
          version = await versionControlService.upgradeVersion(id, 'major', {
            published,
            setAsCurrent: true,
            transacting,
          });
          feedback = await table.feedback.create({ id: version.fullId, ...props }, { transacting });

          // ES - Borramos las id para que se creen nuevas
          // EN - Delete the id to create new
          _.forEach(data.questions, (question) => {
            delete question.id;
          });
        } else {
          if (published) {
            await versionControlService.publishVersion(id, true, { transacting });
          }
          feedback = await table.feedback.update({ id }, props, { transacting });
        }
      } else {
        const version = await versionControlService.register('feedback', {
          published,
          transacting,
        });
        feedback = await table.feedback.create({ id: version.fullId, ...props }, { transacting });
      }

      // -- Asset ---
      if (props.name) {
        const assetsToSave = {
          indexable: true,
          public: true, // TODO Cambiar a false despues de hacer la demo
          category: 'feedback',
        };
        assetsToSave.name = props.name;
        if (props.description) assetsToSave.description = props.description;
        if (props.tagline) assetsToSave.tagline = props.tagline;
        if (props.color) assetsToSave.color = props.color;
        if (props.cover) assetsToSave.cover = props.cover;
        if (tags) assetsToSave.tags = tags;
        const assetService = leemons.getPlugin('leebrary').services.assets;

        let asset;
        if (id) {
          const q = await table.questionsBanks.findOne({ id }, { columns: ['asset'], transacting });
          // -- Asset update
          assetsToSave.id = q.asset;
          asset = await assetService.update(assetsToSave, {
            upgrade: true,
            published,
            userSession,
            transacting,
          });
        } else {
          // -- Asset create
          asset = await assetService.add(assetsToSave, {
            published,
            userSession,
            transacting,
          });
        }

        feedback = await table.feedback.update(
          { id: feedback.id },
          { asset: asset.id },
          { transacting }
        );
      }

      const currentQuestions = await table.feedbackQuestions.find(
        { feedback: feedback.id },
        {
          columns: ['id'],
          transacting,
        }
      );

      // -- Questions --
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
        await deleteFeedbackQuestions(questionsToDelete, { userSession, transacting });
      }

      if (questionsToUpdate.length) {
        await Promise.all(
          _.map(questionsToUpdate, (question) =>
            updateFeedbackQuestion(
              {
                ...question,
              },
              {
                published,
                userSession,
                transacting,
              }
            )
          )
        );
      }

      if (questionsToCreate.length) {
        await Promise.all(
          _.map(questionsToCreate, (question) =>
            createFeedbackQuestion(
              {
                ...question,
                feedback: feedback.id,
              },
              {
                published,
                userSession,
                transacting,
              }
            )
          )
        );
      }

      return feedback;
    },
    table.feedback,
    _transacting
  );
}

module.exports = saveFeedback;
