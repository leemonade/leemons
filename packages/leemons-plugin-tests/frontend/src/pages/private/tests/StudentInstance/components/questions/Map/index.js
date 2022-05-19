/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';
import { Box } from '@bubbles-ui/components';
import QuestionTitle from '../../QuestionTitle';
import QuestionNoteClues from '../../QuestionNoteClues';
import { ButtonNavigation } from '../../ButtonNavigation';
import { QuestionImage } from '../../../../../../../components/QuestionImage';
import Responses from './Responses';

export default function Index(props) {
  const { styles, saveQuestion, store, question, t, isLast } = props;

  const currentResponses = store.questionResponses[question.id].properties?.responses || [];

  let allSelectsUsed = true;
  forEach(question.properties.markers.list, (response, index) => {
    if (!currentResponses.includes(index)) {
      allSelectsUsed = false;
    }
  });

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
        nextLabel={isLast ? t('finishButton') : allSelectsUsed ? t('nextButton') : t('skipButton')}
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
  isLast: PropTypes.bool,
};
