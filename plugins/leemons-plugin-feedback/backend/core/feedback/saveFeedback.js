/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { validateSaveFeedback } = require('../../validations/forms');
const { updateFeedbackQuestion } = require('../feedback-questions/updateFeedbackQuestion');
const { createFeedbackQuestion } = require('../feedback-questions/createFeedbackQuestion');
const { deleteFeedbackQuestions } = require('../feedback-questions/deleteFeedbackQuestions');

async function saveFeedback(_data, { userSession, transacting: _transacting } = {}) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;
  return global.utils.withTransaction(
    async (transacting) => {
      const data = _.cloneDeep(_data);
      delete data.asset;
      _.forEach(data.questions, (question) => {
        delete question.deleted;
        delete question.feedback;
        delete question.assignable;
        delete question.created_at;
        delete question.updated_at;
        delete question.deleted_at;
      });
      // Check is userSession is provided
      if (!userSession) throw new Error('User session is required (saveFeedback)');
      validateSaveFeedback(data);
      const { questions, published } = data;

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
        role: 'feedback',
        statement: data.introductoryText,
        subjects: _.map(data.subjects, ({ level, subject }) => ({
          level,
          subject,
          program: data.program,
        })),
        gradable: false,
        metadata: {
          questions: questions?.length,
          thanksMessage: data.thanksMessage,
        },
      };

      let assignable = null;

      if (data.id) {
        delete toSave.role;
        assignable = await assignableService.updateAssignable(
          { id: data.id, ...toSave },
          {
            userSession,
            transacting,
          }
        );

        if (assignable.id !== data.id) {
          _.forEach(questions, (question) => {
            delete question.id;
          });
        }
      } else {
        assignable = await assignableService.createAssignable(toSave, {
          userSession,
          transacting,
          published: data.published,
        });
      }

      let featuredImage = null;
      if (assignable.metadata.featuredImage) {
        if (data.featuredImage) {
          featuredImage = await leemons.getPlugin('leebrary').services.assets.update(
            {
              id: assignable.metadata.featuredImage,
              name: `Image feedback - ${assignable.id}`,
              cover: data.featuredImage,
              description: '',
              indexable: false,
              public: true,
            },
            {
              published,
              userSession,
              transacting,
            }
          );
        } else {
          await leemons
            .getPlugin('leebrary')
            .services.assets.remove(assignable.metadata.featuredImage, {
              userSession,
              transacting,
            });
        }
      } else if (data.featuredImage) {
        featuredImage = await leemons.getPlugin('leebrary').services.assets.add(
          {
            name: `Image feedback - ${assignable.id}`,
            cover: data.featuredImage,
            description: '',
            indexable: false,
            public: true,
          },
          {
            published,
            userSession,
            transacting,
          }
        );
      }

      toSave.metadata.featuredImage = featuredImage?.id;
      assignable = await assignableService.updateAssignable(
        { id: assignable.id, ...toSave },
        {
          userSession,
          transacting,
          published: data.published,
        }
      );

      const currentQuestions = await table.feedbackQuestions.find(
        { assignable: assignable.id },
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
      _.forEach(questions, (question, index) => {
        if (question.id) {
          if (currentQuestionsIds.includes(question.id)) {
            questionsToUpdate.push({ ...question, order: index });
          } else {
            questionsToCreate.push({ ...question, order: index });
          }
        } else {
          questionsToCreate.push({ ...question, order: index });
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
                assignable: assignable.id,
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

      return assignable;
    },
    table.feedbackQuestions,
    _transacting
  );
}

module.exports = saveFeedback;
