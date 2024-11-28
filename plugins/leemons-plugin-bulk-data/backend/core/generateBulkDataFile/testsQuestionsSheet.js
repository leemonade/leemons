/* eslint-disable camelcase */
const _ = require('lodash');
const TurndownService = require('turndown');

const { styleCell, booleanToYesNoAnswer } = require('./helpers');

const turndown = new TurndownService();

// HELPER FUNCTIONS ············
const getAnswersFieldsForMonoResponse = (question, assetDetails) => {
  const imageAnswers = [];
  const answers = [];
  const answersFeedback = [];
  const answersFeedbackImage = ''; // Currently not used in bulk data load from file function.
  let correctAnswer = 0;

  const answersArray = question.choices;

  answersArray.forEach(({ feedback, text, image, imageDescription, isCorrect, hideOnHelp }, i) => {
    const index = i + 1;

    // Answer string
    let string;
    if (question.hasImageAnswers && image) {
      const imageUrl = assetDetails.find((asset) => asset.id === image.id).cover;
      string = imageDescription ? `${imageUrl}|${imageDescription}` : `${imageUrl}`;
      if (hideOnHelp) string += '@';
      imageAnswers.push(string);
    } else {
      if (text.format === 'html') {
        string = turndown.turndown(text.text);
      } else if (text.format === 'plain') {
        string = text.text;
      }
      if (hideOnHelp) string += '@';
      answers.push(string);
    }

    // Correct response
    if (isCorrect) correctAnswer = index;

    // Feedback on each answer
    if (question.hasAnswerFeedback) {
      if (feedback) {
        if (feedback.format === 'html') {
          answersFeedback.push(`${index}@${turndown.turndown(feedback.text)}`);
        } else if (feedback.format === 'plain') {
          answersFeedback.push(`${index}@${feedback.text}`);
        }
      }
    } else {
      const { globalFeedback } = question;
      if (globalFeedback?.format === 'html') {
        answersFeedback.push(turndown.turndown(globalFeedback?.text ?? ''));
      } else if (globalFeedback?.format === 'plain') {
        answersFeedback.push(globalFeedback?.text ?? '');
      }
    }
  });

  return {
    answers: answers.join('|'),
    answer_correct: correctAnswer,
    answers_feedback: [...new Set(answersFeedback)].join('|'),
    answers_feedback_image: answersFeedbackImage,
    answers_images: imageAnswers.join(', '),
  };
};

const getAnswersFieldsForMaps = (question) => {
  const { markers, caption } = question.mapProperties;
  const { globalFeedback } = question;
  const { type, position, list, backgroundColor } = markers;

  const answersString = list.map((markerObject) => {
    const { left, top, response, hideOnHelp } = markerObject;
    const answerString = `${left}:${top}:${response}`;
    return hideOnHelp ? `${answerString}@` : answerString;
  });

  const positionString = `${position.left}|${position.top}`;
  let mapInfoString = `${type}::${backgroundColor}::${positionString}`;
  if (caption) mapInfoString += `::${caption}`;

  return {
    answers: answersString.join('|'),
    map_info: mapInfoString,
    answers_feedback: turndown.turndown(globalFeedback?.text ?? ''), // No feeedback by answer allowed on map questions
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

const findMultimediaAsset = (multimediaAssets, question) => {
  if (question.type === 'map') {
    return multimediaAssets.find((asset) => asset.id === question.mapProperties.image.id).cover;
  }
  const assetFound = multimediaAssets.find((asset) => asset.id === question.stemResource?.id);
  return assetFound?.url ?? assetFound?.cover;
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
    { header: 'stemResource', key: 'stemResource', width: 20 },
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
    stemResource: 'Stem Resource',
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
      if (question.stemResource?.id) {
        acc.push(question.stemResource.id);
      }
      if (question.hasImageAnswers) {
        question.choices.forEach((choice) => {
          if (choice.image?.id) {
            acc.push(choice.image.id);
          }
        });
      }
      if (question.mapProperties?.image?.id) {
        acc.push(question.mapProperties.image.id);
      }
    });
    return acc;
  }, []);

  const allMultimediaAssetDetails = await ctx.call('leebrary.assets.getByIds', {
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
      const stemResource = findMultimediaAsset(allMultimediaAssetDetails, question);
      const bulkId = `q${questionCounter.toString().padStart(2, '0')}`;

      const commonData = {
        root: bulkId,
        qbank: qBankBulkId,
        type: question.type,
        category: qBankCategories.find((c) => c.id === question.category)?.value,
        level: question.level,
        withImages: booleanToYesNoAnswer(!!question.hasImageAnswers),
        tags: question.tags?.join(', '),
        question: turndown.turndown(question.stem.text),
        clues: question.clues?.join('|'),
        stemResource,
      };

      const answerFields = getAnswerFields(question, allMultimediaAssetDetails);
      const questionObject = { ...commonData, ...answerFields };

      worksheet.addRow(_.omitBy(questionObject, _.isNil));
      questionsToReturn.push({ ...question, bulkId, questionObject, worksheet });
    });
  });

  return questionsToReturn;
}

module.exports = { createTestsQuestionsSheet };
