import React from 'react';

import { Alert, Box } from '@bubbles-ui/components';
import { filter } from 'lodash';
import PropTypes from 'prop-types';

import { getQuestionClues } from '../helpers/getQuestionClues';

export default function QuestionNoteClues(props) {
  const { question, store, t, customStyles } = props;
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
      <Box
        key={index}
        sx={(theme) => ({ ...(customStyles ?? { marginBottom: theme.spacing[4] }) })}
      >
        <Alert severity="info" title={t('hint')} closeable={false}>
          {clue.text}
        </Alert>
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
  customStyles: PropTypes.object,
};
