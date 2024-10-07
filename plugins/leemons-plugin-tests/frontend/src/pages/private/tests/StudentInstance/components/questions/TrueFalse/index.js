import React from 'react';

import { Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import QuestionImage from '../../QuestionImage';
import QuestionNoteClues from '../../QuestionNoteClues';
import QuestionTitle from '../../QuestionTitle';
import UnansweredQuestionWarning from '../../UnansweredQuestionWarning';

import Responses from './Responses';
import ViewModeResponses from './ViewModeResponses';

export default function Index(props) {
  const { styles, store, question } = props;

  let showNotAnsweredWarning = false;
  if (store.viewMode) {
    showNotAnsweredWarning = store.questionResponses[question.id].status === null;
  }

  return (
    <>
      {showNotAnsweredWarning ? <UnansweredQuestionWarning {...props} /> : null}

      <Box className={styles.questionCard}>
        <QuestionTitle {...props} />
        <QuestionNoteClues {...props} />

        <QuestionImage {...props} style={2} />
        {!store.viewMode ? <Responses {...props} /> : <ViewModeResponses {...props} />}
      </Box>
    </>
  );
}

Index.propTypes = {
  styles: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
};
