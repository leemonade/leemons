import { Box, HtmlText } from '@bubbles-ui/components';
import { camelCase } from 'lodash';

import { QUESTION_TYPES } from '@tests/pages/private/questions-banks/questionConstants';

const removeNewLines = (text = '') => {
  return text
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>\s*<p>/gi, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ');
};

// eslint-disable-next-line import/prefer-default-export
export function getQuestionForTable(question, t, styles) {
  let responsesAmount = '-';

  if (question.type === QUESTION_TYPES.MONO_RESPONSE) {
    responsesAmount = question?.choices?.length;
  }
  if (question.type === QUESTION_TYPES.MAP) {
    responsesAmount = question?.mapProperties?.markers?.list?.length;
  }
  if (question.type === QUESTION_TYPES.SHORT_RESPONSE) {
    responsesAmount = question?.choices?.length;
  }

  const typeTranslationKey = camelCase(question.type);

  return {
    ...question,
    question: (
      <Box style={{ width: 220 }} className={styles?.tableCell}>
        <HtmlText truncateLines={2}>{removeNewLines(question.stem.text)}</HtmlText>
      </Box>
    ),
    responses: <Box className={styles?.tableCell}>{responsesAmount}</Box>,
    type: (
      <Box style={{ width: 150 }} className={styles?.tableCell}>
        {t(typeTranslationKey)}
      </Box>
    ),
  };
}
