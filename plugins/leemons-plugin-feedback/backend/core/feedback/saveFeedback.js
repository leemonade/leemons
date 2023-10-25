/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { validateSaveFeedback } = require('../../validations/forms');
const { updateFeedbackQuestion } = require('../feedback-questions/updateFeedbackQuestion');
const { createFeedbackQuestion } = require('../feedback-questions/createFeedbackQuestion');
const { deleteFeedbackQuestions } = require('../feedback-questions/deleteFeedbackQuestions');

async function saveFeedback({ data: _data, ctx }) {
  const { userSession } = ctx.meta;
  const data = _.cloneDeep(_data);
  delete data.asset;
  _.forEach(data.questions, (question) => {
    delete question._id;
    delete question.__v;
    delete question.deploymentID;
    delete question.deleted;
    delete question.feedback;
    delete question.assignable;
    delete question.isDeleted;
    delete question.created_at;
    delete question.updated_at;
    delete question.deleted_at;
    delete question.createdAt;
    delete question.updatedAt;
    delete question.deletedAt;
  });
  // Check is userSession is provided
  if (!userSession)
    throw new LeemonsError(ctx, { message: 'User session is required (saveFeedback)' });
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
    assignable = await ctx.tx.call('assignables.assignables.updateAssignable', {
      assignable: { id: data.id, ...toSave },
    });

    if (assignable.id !== data.id) {
      _.forEach(questions, (question) => {
        delete question.id;
      });
    }
  } else {
    assignable = await ctx.tx.call('assignables.assignables.createAssignable', {
      assignable: toSave,
      published: data.published,
    });
  }

  let featuredImage = null;
  if (assignable.metadata.featuredImage) {
    if (data.featuredImage) {
      featuredImage = await ctx.tx.call('leebrary.assets.update', {
        data: {
          id: assignable.metadata.featuredImage,
          name: `Image feedback - ${assignable.id}`,
          cover: data.featuredImage,
          description: '',
          indexable: false,
          public: true,
        },
        published,
      });
    } else {
      await ctx.tx.call('leebrary.assets.remove', {
        id: assignable.metadata.featuredImage,
      });
    }
  } else if (data.featuredImage) {
    featuredImage = await ctx.tx.call('leebrary.assets.add', {
      asset: {
        name: `Image feedback - ${assignable.id}`,
        cover: data.featuredImage,
        description: '',
        indexable: false,
        public: true,
      },
      published,
    });
  }

  toSave.metadata.featuredImage = featuredImage?.id;
  assignable = await ctx.tx.call('assignables.assignables.updateAssignable', {
    assignable: { id: assignable.id, ...toSave },
    published: data.published,
  });

  const currentQuestions = await ctx.tx.db.FeedbackQuestions.find({ assignable: assignable.id })
    .select(['id'])
    .lean();

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
    await deleteFeedbackQuestions({ questionId: questionsToDelete, ctx });
  }

  if (questionsToUpdate.length) {
    await Promise.all(
      _.map(questionsToUpdate, (question) =>
        updateFeedbackQuestion({
          data: {
            ...question,
          },
          published,
          ctx,
        })
      )
    );
  }

  if (questionsToCreate.length) {
    await Promise.all(
      _.map(questionsToCreate, (question) =>
        createFeedbackQuestion({
          data: {
            ...question,
            assignable: assignable.id,
          },
          published,
          ctx,
        })
      )
    );
  }

  return assignable;
}

module.exports = saveFeedback;
