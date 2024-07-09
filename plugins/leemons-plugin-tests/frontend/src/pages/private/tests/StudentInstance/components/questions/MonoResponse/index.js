/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack } from '@bubbles-ui/components';
import QuestionTitle from '../../QuestionTitle';
import QuestionNoteClues from '../../QuestionNoteClues';
import QuestionImage from '../../QuestionImage';
import Responses from './Responses';
import QuestionNotResponsedWarning from '../../QuestionNotResponsedWarning';

export default function Index(props) {
  const { styles, saveQuestion, store, question, t, isLast, isPreviewMode } = props;

  function nextStep() {
    if (!store.viewMode) saveQuestion();
    props.nextStep();
  }

  let showNotResponsedWarning = false;
  if (store.viewMode) {
    showNotResponsedWarning = store.questionResponses[question.id].status === null;
  }

  return (
    <>
      {showNotResponsedWarning ? <QuestionNotResponsedWarning {...props} /> : null}

      <Box className={styles.questionCard}>
        <QuestionTitle {...props} />
        <QuestionNoteClues {...props} />
        {!question.withImages && question.questionImage?.cover ? (
          <>
            <Stack fullWidth spacing={4}>
              <Box>
                <QuestionImage {...props} />
              </Box>
              <Box>
                <Responses {...props} />
              </Box>
            </Stack>
          </>
        ) : (
          <>
            <QuestionImage {...props} />
            <Responses {...props} />
          </>
        )}
      </Box>
    </>
  );
}

Index.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isLast: PropTypes.bool,
  isFirstStep: PropTypes.bool,
  saveQuestion: PropTypes.func,
};
