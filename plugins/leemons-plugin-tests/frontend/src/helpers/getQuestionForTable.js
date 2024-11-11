import { Box, HtmlText } from '@bubbles-ui/components';
import { camelCase } from 'lodash';

import { QUESTION_TYPES } from '@tests/pages/private/questions-banks/questionConstants';

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
      <Box className={styles?.tableCell}>
        <HtmlText>{question.stem.text}</HtmlText>
      </Box>
    ),
    responses: (
      <Box style={{ minWidth: '100px' }} className={styles?.tableCell}>
        {responsesAmount}
      </Box>
    ),
    type: (
      <Box style={{ minWidth: '150px' }} className={styles?.tableCell}>
        {t(typeTranslationKey)}
      </Box>
    ),
  };
}
