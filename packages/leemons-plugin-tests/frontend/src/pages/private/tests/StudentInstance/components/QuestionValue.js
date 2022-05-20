import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ImageLoader, Text } from '@bubbles-ui/components';
import { getQuestionClues } from '../helpers/getQuestionClues';

export default function QuestionValue(props) {
  const { styles, cx, t, store, render, question, saveQuestion } = props;

  const usedClues = store.questionResponses[question.id].clues;
  const clues = React.useMemo(() => getQuestionClues(question), [question]);

  function useClue() {
    if (!store.viewMode) {
      if (clues.length > store.questionResponses[question.id].clues) {
        store.questionResponses[question.id].clues += 1;
        saveQuestion();
      }
      render();
    }
  }

  return (
    <Box className={styles.questionValueContainer}>
      <Box>
        <Text size="xs" color="secondary">
          {t('theQuestionValueIs')}
        </Text>
      </Box>
      <Box style={{ display: 'flex' }}>
        {/* -- Question value -- */}
        {!store.viewMode ? (
          <Box className={styles.questionValueCard}>
            <Box>
              <Text size="md" sx={(theme) => ({ color: theme.colors.fatic02 })}>
                {store.questionsInfo.perQuestion}
              </Text>
            </Box>
            <Text size="xs" color="primary">
              {t('pointsInTotal')}
            </Text>
          </Box>
        ) : null}

        {/* -- Question clues -- */}
        {clues.length ? (
          <Box className={cx(styles.questionValueCard, styles.questionCluesCard)}>
            {clues.map((value, index) => (
              <Box key={index} className={styles.questionClueIcon}>
                <ImageLoader src={`/public/tests/clue-${index < usedClues ? 'off' : 'on'}.svg`} />
              </Box>
            ))}

            {!store.viewMode ? (
              <Button variant="link" onClick={useClue}>
                {t('askForAHint')}
              </Button>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

QuestionValue.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  question: PropTypes.any,
  store: PropTypes.any,
  prevStep: PropTypes.func,
  render: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  index: PropTypes.number,
  saveQuestion: PropTypes.func,
};
