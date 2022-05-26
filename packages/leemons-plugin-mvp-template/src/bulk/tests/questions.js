const path = require('path');
const { keys, trim, isEmpty, find } = require('lodash');
const showdown = require('showdown');
const itemsImport = require('../helpers/simpleListImport');

const converter = new showdown.Converter();

async function importQuestions() {
  const filePath = path.resolve(__dirname, '../data.xlsx');
  const items = await itemsImport(filePath, 'te_questions', 40);

  keys(items).forEach((key) => {
    const question = items[key];

    question.tags = (question.tags || '')
      .split(',')
      .map((val) => trim(val))
      .filter((val) => !isEmpty(val));

    // ·····················································
    // ANSWERS

    const feedbacks = (question.answers_feedback || '')
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

    console.log('- FEEDBACKS -');
    console.dir(feedbacks, { depth: null });

    delete question.answers_feedback;

    question.answers = (question.answers || '')
      .split('|')
      .map((val) => trim(val))
      .filter((val) => !isEmpty(val))
      .map((answer, index) => {
        const { feedback } = find(feedbacks, { answer: index + 1 }) || {};

        return {
          answer: converter.makeHtml(answer),
          feedback,
          isCorrect: Number(question.answer_correct) === index + 1,
        };
      });

    items[key] = question;
  });

  return items;
}

module.exports = importQuestions;
