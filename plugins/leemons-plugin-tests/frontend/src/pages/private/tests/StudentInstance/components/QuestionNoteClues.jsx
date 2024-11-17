import React from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import { Alert, Box } from '@bubbles-ui/components';
import { getQuestionClues } from '../helpers/getQuestionClues';

export default function QuestionNoteClues(props) {
  const { styles, question, store, t } = props;
  const clues = React.useMemo(
    () =>
      filter(
        getQuestionClues(question, store.questionResponses?.[question.id].cluesTypes, store.config),
        {
          type: 'note',
        }
      ),
    [question, store.questionResponses?.[question.id].clues]
  );

  if (clues.length) {
    return clues.map((clue, index) => (
      <Box key={index} sx={(theme) => ({ marginBottom: theme.spacing[4] })}>
        <Alert severity="info" title={t('hint')} closeable={false}>
          {clue.text}
        </Alert>
        {/*
      <Box key={index} className={styles.questionClueCard}>
        <Box sx={(theme) => ({ marginBottom: theme.spacing[1] })}>
          <Text size="md" color="primary">
            {t('hint')}
          </Text>
        </Box>
        <Text size="md" color="tertiary" role="productive">
          {clue.text}
        </Text>
      </Box>
  */}
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
