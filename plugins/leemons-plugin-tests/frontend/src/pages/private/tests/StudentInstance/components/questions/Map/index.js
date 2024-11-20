import React from 'react';

import { Alert, Box, HtmlText, Text } from '@bubbles-ui/components';
import { find, forEach, isNumber } from 'lodash';
import PropTypes from 'prop-types';

import { QuestionImage } from '../../../../../../../components/QuestionImage';
import { getQuestionClues } from '../../../helpers/getQuestionClues';
import { htmlToText } from '../../../helpers/htmlToText';
import QuestionNoteClues from '../../QuestionNoteClues';
import QuestionTitle from '../../QuestionTitle';
import UnansweredQuestionWarning from '../../UnansweredQuestionWarning';

import Responses from './Responses';

export default function Index(props) {
  const { styles, store, question, t, cx } = props;

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
    // Currently global feedback is mandatory for map questions, but some bulk tamplates map questions have no global feedback as they were created before this update.
    if (question.globalFeedback?.text) {
      explanation = htmlToText(question.globalFeedback.text);
    }
  }
  return (
    <>
      {showNotResponsedWarning ? <UnansweredQuestionWarning {...props} /> : null}

      <Box className={styles.questionCard}>
        <QuestionTitle {...props} tableViewMode={store.viewMode} />
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
        {explanation && (
          <Box className={cx(styles.textExplanation, styles.textExplanationRemovePadding)}>
            <Box sx={(theme) => ({ paddingBottom: theme.spacing[3] })}>
              <Text role="productive" size="xs" color="primary">
                {t('explanation').toUpperCase()}
              </Text>
            </Box>
            <HtmlText>{explanation}</HtmlText>
          </Box>
        )}
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
