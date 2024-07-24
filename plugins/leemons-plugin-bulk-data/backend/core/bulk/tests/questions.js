const { keys, trim, isNil, isEmpty, isString, isArray } = require('lodash');
const showdown = require('showdown');
const itemsImport = require('../helpers/simpleListImport');

const converter = new showdown.Converter();

async function importQuestions(filePath) {
  const items = await itemsImport(filePath, 'te_questions', 40, true, true);
  const questions = [];

  keys(items)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const question = items[key];

      question.question = converter.makeHtml(question.question || '');

      question.tags = (question.tags || '')
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val));

      question.tags = question.tags || [];

      question.clues = (question.clues || '')
        .split('|')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((value) => ({ value }));

      // ·····················································
      // FEEDBACK

      const answerFeedback = (question.answers_feedback || '')
        .split('|')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((feedbackItem) => {
          const [answer, feedback] = feedbackItem.split('@');
          return {
            answer: Number(answer),
            feedback: converter.makeHtml(feedback),
          };
        });

      // ·····················································
      // PROPERTIES

      const properties = {};

      const eachAnswerHasItsExplanation = answerFeedback?.length > 1;
      if (eachAnswerHasItsExplanation) {
        properties.explanationInResponses = true;
        properties.explanation = '<p></p>';
      } else {
        properties.explanation = converter.makeHtml(question.answers_feedback) || '';
      }

      // ·····················································
      // RESPONSES

      const imageResponses = Boolean(question.withImages && question.answers_images);
      const responseBreak = imageResponses ? ',' : '|';

      if (
        imageResponses &&
        !isString(question.answers_images) &&
        isArray(question.answers_images?.richText)
      ) {
        question.answers_images = question.answers_images.richText
          .map((item) => item.text)
          .join('');
      }

      try {
        properties.responses = String(
          (imageResponses ? question.answers_images : question.answers) || question.answers || ''
        )
          .split(responseBreak)
          .map((val) => trim(val))
          .filter((val) => !isEmpty(val))
          .map((answer, index) => {
            const { feedback } = answerFeedback.find((item) => item.answer === index + 1) || {};
            const hideOnHelp = answer.slice(-1) === '@';
            let response = answer;

            if (hideOnHelp) {
              response = answer.slice(0, -1);
            }

            const value = {
              explanation: feedback || null,
              isCorrectResponse: Number(question.answer_correct) === index + 1,
              hideOnHelp,
            };

            if (imageResponses) {
              const [url, caption] = response.split('|');
              value.image = url;
              value.imageDescription = caption;
            } else {
              value.response = response;
            }

            return { value };
          });
      } catch (e) {
        console.log('-- QUESTIONS IMPORT ERROR --');
        console.log(e);
        console.log('imageResponses:', imageResponses);
        console.log('question.answers_images:', question.answers_images);
        console.log('question.answers:', question.answers);
        console.log('---------------------------------');
        properties.responses = [];
      }
      // ·····················································
      // QUESTION MAP

      if (question.type === 'map') {
        if (!isEmpty(question.questionImage)) {
          properties.image = question.questionImage;
          delete question.questionImage;
        }

        const mapInfo = question.map_info.split('::').map((val) => trim(val));

        const [type, backgroundColor, positionString, mapImageCaption] = mapInfo;
        const [positionLeft, positionTop] = positionString.split('|');

        if (mapImageCaption?.length) {
          properties.caption = mapImageCaption;
        }
        properties.markers = {
          backgroundColor,
          list: properties.responses.map(({ value }) => {
            const [left, top, response] = value.response.split(':');
            return { left, top, response, hideOnHelp: value?.hideOnHelp || undefined };
          }),
          position: { left: positionLeft, top: positionTop },
          type,
        };

        delete properties.responses;
        delete question.answers_feedback_image;
      }

      question.properties = properties;

      // ·····················································
      // CLEAN

      delete question.answers;
      delete question.answers_feedback;
      delete question.answer_correct;
      delete question.answers_images;
      delete question.answers_feedback_image;
      delete question.map_info;

      items[key] = question;
      questions.push(question);
    });

  return { items, questions };
}

module.exports = importQuestions;
