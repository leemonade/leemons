import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@bubbles-ui/components';
import { filter } from 'lodash';
import { getQuestionClues } from '../helpers/getQuestionClues';

export default function QuestionNoteClues(props) {
  const { styles, question, store, t } = props;
  const clues = React.useMemo(
    () =>
      filter(
        getQuestionClues(question, store.questionResponses?.[question.id].clues, store.config),
        {
          type: 'note',
        }
      ),
    [question, store.questionResponses?.[question.id].clues]
  );

  if (clues.length) {
    return clues.map((clue, index) => (
      <Box key={index} className={styles.questionClueCard}>
        <Box sx={(theme) => ({ marginBottom: theme.spacing[1] })}>
          <Text size="md" color="primary">
            {t('hint')}
          </Text>
        </Box>
        <Text size="md" color="tertiary" role="productive">
          {clue.text}
        </Text>
        {/* <Box className={styles.questionCluePerson} /> */}
      </Box>
    ));
  }
  return null;
}

QuestionNoteClues.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
};
