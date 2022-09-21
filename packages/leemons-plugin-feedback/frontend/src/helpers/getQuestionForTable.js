import React from 'react';
import { Box, HtmlText } from '@bubbles-ui/components';

// eslint-disable-next-line import/prefer-default-export
export function getQuestionForTable(question, t, styles) {
  let responses = '-';
  if (question.type === 'singleResponse' || question.type === 'multiResponse') {
    responses = question.properties.responses.length;
  }
  return {
    ...question,
    question: (
      <Box className={styles?.tableCell}>
        <HtmlText>{question.question}</HtmlText>
      </Box>
    ),
    responses: (
      <Box style={{ minWidth: '100px' }} className={styles?.tableCell}>
        {responses}
      </Box>
    ),
    type: (
      <Box style={{ minWidth: '150px' }} className={styles?.tableCell}>
        {t(question.type)}
      </Box>
    ),
  };
}
