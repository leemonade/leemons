/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { find, forEach, isNumber } from 'lodash';
import { Alert, Box } from '@bubbles-ui/components';
import QuestionTitle from '../../QuestionTitle';
import QuestionNoteClues from '../../QuestionNoteClues';
import { ButtonNavigation } from '../../ButtonNavigation';
import { QuestionImage } from '../../../../../../../components/QuestionImage';
import Responses from './Responses';
import { getQuestionClues } from '../../../helpers/getQuestionClues';
import QuestionNotResponsedWarning from '../../QuestionNotResponsedWarning';

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
    if (!store.viewMode) saveQuestion();
    props.nextStep();
  }

  const clue = React.useMemo(
    () =>
      find(getQuestionClues(question, store.questionResponses[question.id].clues), {
        type: 'hide-response',
      }),
    [question, store.questionResponses[question.id].clues]
  );

  let used = false;
  let allWithValues = false;
  if (store.questionResponses[question.id]?.properties?.responses) {
    allWithValues = true;
    used = true;
    forEach(question.properties.markers.list, (r, index) => {
      if (!isNumber(store.questionResponses[question.id].properties.responses[index])) {
        allWithValues = false;
      }
    });
  }

  let showNotResponsedWarning = false;
  if (store.viewMode) {
    showNotResponsedWarning = !allWithValues;
  }

  return (
    <>
      {showNotResponsedWarning ? <QuestionNotResponsedWarning {...props} /> : null}

      <Box className={styles.questionCard}>
        <QuestionTitle {...props} />
        <Box className={styles.mapImageContainer}>
          <QuestionImage
            src={question.properties.image}
            markers={question.properties.markers}
            values={
              store.viewMode ? store.questionResponses[question.id].properties?.responses : null
            }
            clue={clue}
          />
        </Box>
        <Responses {...props} />
      </Box>
      <QuestionNoteClues {...props} />

      {!store.viewMode && !allWithValues && used ? (
        <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
          <Alert title={t('attention')} severity="warning" closeable={false}>
            {t('mapNeedResponses')}
          </Alert>
        </Box>
      ) : null}

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
