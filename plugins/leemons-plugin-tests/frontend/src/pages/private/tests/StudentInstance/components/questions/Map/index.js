/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { find, forEach, isNumber } from 'lodash';
import { Alert, Box, HtmlText, Text } from '@bubbles-ui/components';
import QuestionTitle from '../../QuestionTitle';
import QuestionNoteClues from '../../QuestionNoteClues';
import { QuestionImage } from '../../../../../../../components/QuestionImage';
import Responses from './Responses';
import { getQuestionClues } from '../../../helpers/getQuestionClues';
import UnansweredQuestionWarning from '../../UnansweredQuestionWarning';
import { htmlToText } from '../../../helpers/htmlToText';

export default function Index(props) {
  const { styles, saveQuestion, store, question, t, isLast, cx } = props;

  function nextStep() {
    if (!store.viewMode) saveQuestion();
    props.nextStep();
  }

  const clue = React.useMemo(
    () =>
      find(getQuestionClues(question, store.questionResponses[question.id].clues, store.config), {
        type: 'hide-response',
      }),
    [question, store.questionResponses[question.id].clues]
  );

  let used = false;
  let allWithValues = false;
  if (store.questionResponses[question.id]?.properties?.responses) {
    allWithValues = true;
    used = true;
    forEach(question.mapProperties.markers.list, (r, index) => {
      if (!isNumber(store.questionResponses[question.id].properties.responses[index])) {
        allWithValues = false;
      }
    });
  }

  let showNotResponsedWarning = false;
  let explanation = null;
  if (store.viewMode) {
    showNotResponsedWarning = !allWithValues;
    const text = htmlToText(question.globalFeedback?.text);
    if (text) explanation = question.globalFeedback.text;
  }
  return (
    <>
      {showNotResponsedWarning ? <UnansweredQuestionWarning {...props} /> : null}

      <Box className={styles.questionCard}>
        <QuestionTitle {...props} />
        <QuestionNoteClues {...props} />
        <Box className={styles.mapImageContainer}>
          <QuestionImage
            src={question.mapProperties.image}
            markers={question.mapProperties.markers}
            values={
              store.viewMode ? store.questionResponses[question.id].properties?.responses : null
            }
            clue={clue}
          />
        </Box>
        {explanation ? (
          <Box className={cx(styles.textExplanation, styles.textExplanationRemovePadding)}>
            <Box sx={(theme) => ({ paddingBottom: theme.spacing[3] })}>
              <Text role="productive" size="xs" color="primary">
                {t('explanation').toUpperCase()}
              </Text>
            </Box>
            <HtmlText>{explanation}</HtmlText>
          </Box>
        ) : null}
        <Responses {...props} />
      </Box>

      {!store.viewMode && !allWithValues && used ? (
        <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
          <Alert title={t('attention')} severity="warning" closeable={false}>
            {t('mapNeedResponses')}
          </Alert>
        </Box>
      ) : null}
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
