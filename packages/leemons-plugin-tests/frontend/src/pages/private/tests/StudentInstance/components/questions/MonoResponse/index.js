import React from 'react';
import PropTypes from 'prop-types';
import { isNumber } from 'lodash';
import { Box, Stack } from '@bubbles-ui/components';
import QuestionTitle from '../../QuestionTitle';
import QuestionNoteClues from '../../QuestionNoteClues';
import QuestionImage from '../../QuestionImage';
import Responses from './Responses';
import { ButtonNavigation } from '../../ButtonNavigation';

export default function Index(props) {
  const { styles, saveQuestion, store, question, t } = props;

  const currentResponseIndex = store.questionResponses[question.id].properties?.response;

  function nextStep() {
    saveQuestion();
    props.nextStep();
  }

  return (
    <>
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
      <QuestionNoteClues {...props} />
      <ButtonNavigation
        {...props}
        nextStep={nextStep}
        nextLabel={isNumber(currentResponseIndex) ? t('nextButton') : t('skipButton')}
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
  isFirstStep: PropTypes.bool,
  saveQuestion: PropTypes.func,
};
