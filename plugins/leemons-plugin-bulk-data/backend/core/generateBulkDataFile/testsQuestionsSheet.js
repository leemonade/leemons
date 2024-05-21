/* eslint-disable camelcase */
const _ = require('lodash');
const TurndownService = require('turndown');

const { styleCell, booleanToYesNoAnswer } = require('./helpers');

const turndown = new TurndownService();

// HELPER FUNCTIONS ············
const getAnswersStringForMonoResponse = (question, assetDetails) => {
  const answersImages = [];
  const answers = [];
  const answersFeedback = [];
  const answersFeedbackImage = ''; // Currently not used in bulk data load from file function.
  let answerCorrect = 0;

  const answersArray = question.properties?.responses;

  answersArray.forEach(
    (
      { value: { explanation, response, image, imageDescription, isCorrectResponse, hideOnHelp } },
      i
    ) => {
      const index = i + 1;

      // Answer string
      let string;
      if (image) {
        const imageUrl = assetDetails.find((asset) => asset.id === image.id).cover;
        string = imageDescription ? `${imageUrl}|${imageDescription}` : `${imageUrl}`;
      } else {
        string = response;
      }

      if (hideOnHelp) string += '@';

      if (question.withImages) {
        answersImages.push(string);
      } else {
        answers.push(string);
      }

      // Correct response
      if (isCorrectResponse) answerCorrect = index;

      // Answer feedback
      if (question.properties?.explanationInResponses) {
        if (!_.isEmpty(explanation))
          answersFeedback.push(`${index}@${turndown.turndown(explanation)}`);
      } else {
        answersFeedback.push(turndown.turndown(question.properties.explanation ?? ''));
      }
    }
  );

  return {
    answers: answers.join('|'),
    answer_correct: answerCorrect,
    answers_feedback: [...new Set(answersFeedback)].join('|'),
    answers_feedback_image: answersFeedbackImage,
    answers_images: answersImages.join(', '),
  };
};

async function createTestsQuestionsSheet({ workbook, qBanks, ctx }) {
  const worksheet = workbook.addWorksheet('te_questions');

  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'qbank', key: 'qbank', width: 20 },
    { header: 'type', key: 'type', width: 20 },
    { header: 'category', key: 'category', width: 20 },
    { header: 'level', key: 'level', width: 20 },
    { header: 'withImages', key: 'withImages', width: 10 },
    { header: 'tags', key: 'tags', width: 20 },
    { header: 'question', key: 'question', width: 30 },
    { header: 'questionImage', key: 'questionImage', width: 20 },
    { header: 'answers', key: 'answers', width: 30 },
    { header: 'answers_images', key: 'answers_images', width: 20 },
    { header: 'answer_correct', key: 'answer_correct', width: 15 },
    { header: 'answers_feedback', key: 'answers_feedback', width: 30 },
    { header: 'clues', key: 'clues', width: 20 },
    { header: 'answers_feedback_image', key: 'answers_feedback_image', width: 20 },
  ];

  // Headers row
  worksheet.addRow({
    root: 'BulkId',
    qbank: 'QBankID',
    type: 'Type',
    category: 'Category',
    level: 'Level',
    withImages: 'With Images',
    tags: 'Tags',
    question: 'Question',
    questionImage: 'Question Image',
    answers: 'Answers',
    answers_images: 'Answers Images',
    answer_correct: 'Correct Answer',
    answers_feedback: 'Answers Feedback',
    clues: 'Clues',
    answers_feedback_image: 'Answers Feedback Image',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const allImageAssets = qBanks.reduce((acc, qBank) => {
    qBank.providerData.questions.forEach((question) => {
      if (question.questionImage?.id) {
        acc.push(question.questionImage.id);
      }
      if (question.withImages) {
        question.properties.responses.forEach((response) => {
          if (response.value.image?.id) {
            acc.push(response.value.image.id);
          }
        });
      }
    });
    return acc;
  }, []);

  const allImageAssetDetails = await ctx.call('leebrary.assets.getByIds', {
    ids: [...allImageAssets].flat(),
    shouldPrepareAssets: true,
    withFiles: true,
  });

  qBanks.forEach(({ providerData, bulkId: qBankBulkId }) => {
    const { questions } = providerData;
    questions?.forEach((question, i) => {
      const bulkId = `q${(i + 1).toString().padStart(2, '0')}`;
      const questionObject = {
        root: bulkId,
        qbank: qBankBulkId,
        type: question.type,
        category: question.category, // todo get quetestionBankCategory detail
        level: question.level,
        withImages: booleanToYesNoAnswer(question.withImages),
        tags: question.tags?.join(', '),
        question: turndown.turndown(question.question ?? ''),
        questionImage: allImageAssetDetails.find((asset) => asset.id === question.questionImage?.id)
          ?.cover,
        clues: question.clues?.map((item) => item.value)?.join('|'),
        ...getAnswersStringForMonoResponse(question, allImageAssetDetails),
      };

      worksheet.addRow(_.omitBy(questionObject, _.isNil));
    });
  });
}

module.exports = { createTestsQuestionsSheet };
