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

      question.stem = {
        format: 'html',
        text: converter.makeHtml(question.question || ''),
      };

      question.tags = (question.tags || '')
        .split(',')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val));

      question.tags = question.tags || [];

      question.clues = (question.clues || '')
        .split('|')
        .map((val) => trim(val))
        .filter((val) => !isEmpty(val))
        .map((value) => value);

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

      if (answerFeedback?.length > 1) {
        question.hasAnswerFeedback = true;
        question.globalFeedback = null;
      } else if (question.answers_feedback?.length) {
        question.hasAnswerFeedback = false;
        question.globalFeedback = {
          format: 'html',
          text: converter.makeHtml(question.answers_feedback),
        };
      } else {
        question.hasAnswerFeedback = false;
        question.globalFeedback = null;
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

      if (question.type === 'mono-response') {
        try {
          question.choices = String(
            (imageResponses ? question.answers_images : question.answers) || ''
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
                feedback: feedback ? { format: 'plain', text: feedback } : null,
                isCorrect: Number(question.answer_correct) === index + 1,
                hideOnHelp,
              };

              if (imageResponses) {
                const [url, caption] = response.split('|');
                value.image = url;
                value.imageDescription = caption;
              } else {
                value.text = { text: response, format: 'plain' };
              }

              return value;
            });
        } catch (e) {
          console.log('-- QUESTIONS IMPORT ERROR --');
          console.log(e);
          console.log('imageResponses:', imageResponses);
          console.log('question.answers_images:', question.answers_images);
          console.log('question.answers:', question.answers);
          console.log('---------------------------------');
          question.choices = [];
        }
      }
      // ·····················································
      // QUESTION MAP

      if (question.type === 'map') {
        if (!isEmpty(question.stemResource)) {
          question.mapProperties = { image: question.stemResource };
          delete question.stemResource;
        }

        const mapInfo = question.map_info.split('::').map((val) => trim(val));

        const [type, backgroundColor, positionString, mapImageCaption] = mapInfo;
        const [positionLeft, positionTop] = positionString.split('|');

        if (mapImageCaption?.length) {
          question.mapProperties.caption = mapImageCaption;
        }
        question.mapProperties.markers = {
          backgroundColor,
          list: question.answers
            .split(responseBreak)
            .map((val) => trim(val))
            .filter((val) => !isEmpty(val))
            .map((answer) => {
              const hideOnHelp = answer.slice(-1) === '@';
              const responseValue = hideOnHelp ? answer.slice(0, -1) : answer;
              const [left, top, response] = responseValue.split(':');

              return { left, top, response, hideOnHelp: hideOnHelp || undefined };
            }),
          position: { left: positionLeft, top: positionTop },
          type,
        };
      }

      // ·····················································
      // CLEAN

      delete question.answers;
      delete question.answers_feedback;
      delete question.answer_correct;
      delete question.answers_images;
      delete question.answers_feedback_image;
      delete question.map_info;
      delete question.question;
      question.hasImageAnswers = question.withImages;
      delete question.withImages;

      items[key] = question;
      questions.push(question);
    });

  return { items, questions };
}

module.exports = importQuestions;
