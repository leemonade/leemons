import React from 'react';
import PropTypes from 'prop-types';
import { isNumber } from 'lodash';
import { Box } from '@bubbles-ui/components';
import QuestionTitle from '../../QuestionTitle';
import QuestionNoteClues from '../../QuestionNoteClues';
import { ButtonNavigation } from '../../ButtonNavigation';
import { QuestionImage } from '../../../../../../../components/QuestionImage';
import Responses from './Responses';

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
        <Box className={styles.mapImageContainer}>
          <QuestionImage src={question.properties.image} markers={question.properties.markers} />
        </Box>
        <Responses {...props} />
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
