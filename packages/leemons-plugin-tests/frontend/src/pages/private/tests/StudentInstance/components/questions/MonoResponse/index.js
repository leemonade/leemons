/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack } from '@bubbles-ui/components';
import { isNumber } from 'lodash';
import QuestionTitle from '../../QuestionTitle';
import QuestionNoteClues from '../../QuestionNoteClues';
import QuestionImage from '../../QuestionImage';
import Responses from './Responses';
import { ButtonNavigation } from '../../ButtonNavigation';
import QuestionNotResponsedWarning from '../../QuestionNotResponsedWarning';

export default function Index(props) {
  const { styles, saveQuestion, store, question, t, isLast } = props;

  const currentResponseIndex = store.questionResponses?.[question.id].properties?.response;

  function nextStep() {
    if (!store.viewMode) saveQuestion();
    props.nextStep();
  }

  let showNotResponsedWarning = false;
  if (store.viewMode) {
    showNotResponsedWarning = store.questionResponses[question.id].status === null;
  }

  let nextLabel = null;
  if (store.config.canOmitQuestions) {
    nextLabel = isNumber(currentResponseIndex) ? t('nextButton') : t('skipButton');
  } else {
    nextLabel = t('nextButton');
  }
  if (isLast) {
    nextLabel = t('finishButton');
  }

  let disableNext = !store.config.canOmitQuestions;
  if (isNumber(currentResponseIndex)) {
    disableNext = false;
  }

  return (
    <>
      {showNotResponsedWarning ? <QuestionNotResponsedWarning {...props} /> : null}

      <QuestionNoteClues {...props} />

      <Box className={styles.questionCard}>
        <QuestionTitle {...props} />
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

      <ButtonNavigation
        {...props}
        nextStep={nextStep}
        nextLabel={nextLabel}
        disableNext={disableNext}
      />
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
