/* eslint-disable camelcase */
const _ = require('lodash');
const TurndownService = require('turndown');

const { styleCell, booleanToYesNoAnswer } = require('./helpers');

const turndown = new TurndownService();

// HELPER FUNCTIONS ············
const getAnswersFieldsForMonoResponse = (question, assetDetails) => {
  const answersImages = [];
  const answers = [];
  const answersFeedback = [];
  const answersFeedbackImage = ''; // Currently not used in bulk data load from file function.
  let correctAnswer = 0;

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
      if (isCorrectResponse) correctAnswer = index;

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
    answer_correct: correctAnswer,
    answers_feedback: [...new Set(answersFeedback)].join('|'),
    answers_feedback_image: answersFeedbackImage,
    answers_images: answersImages.join(', '),
  };
};

const getAnswersFieldsForMaps = (question) => {
  const { markers, caption, explanation } = question.properties;
  const { type, position, list, backgroundColor } = markers;

  const answersString = list.map((markerObject) => {
    let hideOnHelp = false;
    const answerString = Object.keys(markerObject)
      .map((key) => {
        if (key === 'hideOnHelp') {
          hideOnHelp = markerObject[key];
          return '';
        }
        return markerObject[key];
      })
      .join(':');
    return hideOnHelp ? `${answerString}@` : answerString;
  });

  const positionString = `${position.left}|${position.top}`;
  let mapInfoString = `${type}::${backgroundColor}::${positionString}`;
  if (caption) mapInfoString += `::${caption}`;

  return {
    answers: answersString.join('|'),
    map_info: mapInfoString,
    answers_feedback: explanation,
  };
};

const getAnswerFields = (question, allImageAssetDetails) => {
  if (question.type === 'mono-response') {
    return getAnswersFieldsForMonoResponse(question, allImageAssetDetails);
  }

  if (question.type === 'map') {
    return getAnswersFieldsForMaps(question);
  }
  return {};
};

const findQuestionImage = (imageAssets, question) => {
  if (question.type === 'map') {
    return imageAssets.find((asset) => asset.id === question.properties.image.id).cover;
  }
  return imageAssets.find((asset) => asset.id === question.questionImage?.id)?.cover;
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
    { header: 'map_info', key: 'map_info', width: 20 },
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
    map_info: 'Map Info',
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
      if (question.properties.image?.id) {
        acc.push(question.properties.image.id);
      }
    });
    return acc;
  }, []);

  const allImageAssetDetails = await ctx.call('leebrary.assets.getByIds', {
    ids: [...allImageAssets].flat(),
    shouldPrepareAssets: true,
    signedURLExpirationTime: 7 * 24 * 60 * 60, // 7 days
    withFiles: true,
  });

  const questionsToReturn = [];
  let questionCounter = 0;
  qBanks.forEach(({ providerData, bulkId: qBankBulkId }) => {
    const { questions } = providerData;
    const { categories: qBankCategories } = providerData;
    questions?.forEach((question) => {
      questionCounter++;
      const questionImage = findQuestionImage(allImageAssetDetails, question);
      const bulkId = `q${questionCounter.toString().padStart(2, '0')}`;

      const commonData = {
        root: bulkId,
        qbank: qBankBulkId,
        type: question.type,
        category: qBankCategories.find((c) => c.id === question.category)?.value,
        level: question.level,
        withImages: booleanToYesNoAnswer(!!question.withImages),
        tags: question.tags?.join(', '),
        question: turndown.turndown(question.question ?? ''),
        clues: question.clues?.map((item) => item.value)?.join('|'),
        questionImage,
      };

      const answerFields = getAnswerFields(question, allImageAssetDetails);
      const questionObject = { ...commonData, ...answerFields };

      worksheet.addRow(_.omitBy(questionObject, _.isNil));
      questionsToReturn.push({ ...question, bulkId, questionObject, worksheet });
    });
  });

  return questionsToReturn;
}

module.exports = { createTestsQuestionsSheet };
