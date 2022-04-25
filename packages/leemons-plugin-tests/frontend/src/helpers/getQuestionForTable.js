import React from 'react';
import { HtmlText } from '@bubbles-ui/components';
import { questionTypeT } from '../pages/private/questions-banks/components/QuestionForm';

// eslint-disable-next-line import/prefer-default-export
export function getQuestionForTable(question, t) {
  let responses = '-';
  if (question.type === 'mono-response') {
    responses = question.properties.responses.length;
  }
  return {
    ...question,
    question: <HtmlText>{question.question}</HtmlText>,
    responses,
    type: t(questionTypeT[question.type]),
  };
}
