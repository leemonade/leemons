import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, COLORS, ImageLoader, Text } from '@bubbles-ui/components';
import { forEach, keyBy } from 'lodash';
import { getQuestionClues } from '../helpers/getQuestionClues';

export default function QuestionValue(props) {
  const { styles, cx, t, store, render, question, saveQuestion } = props;

  const usedClues = store.questionResponses?.[question.id].clues;
  const clues = React.useMemo(() => getQuestionClues(question, 9999, store.config), [question]);
  const cluesConfigByType = React.useMemo(
    () => keyBy(store.config.clues, 'type'),
    [store.config.clues]
  );
  let clueLessPoints = 0;
  const usedCluesObj = [];

  forEach(clues, (clue, index) => {
    if (index < usedClues) {
      const lessPoints =
        store.questionsInfo.perQuestion * (cluesConfigByType[clue.type].value / 100);
      usedCluesObj.push({
        points: `-${lessPoints.toFixed(2)}`,
        index,
      });
      clueLessPoints += lessPoints;
    }
  });

  function useClue() {
    if (!store.viewMode) {
      if (clues.length > store.questionResponses[question.id].clues) {
        store.questionResponses[question.id].clues += 1;
        saveQuestion();
      }
      render();
    }
  }

  const colorByStatus = {
    ok: COLORS.fatic02,
    ko: COLORS.fatic01,
    null: null,
  };

  if (store.embedded && store.viewMode) {
    return null;
  }

  return (
    <Box className={styles.questionValueContainer}>
      <Box>
        {!store.embedded ? (
          <Text size="xs" color="secondary">
            {t('theQuestionValueIs')}
          </Text>
        ) : null}
      </Box>
      <Box style={{ display: 'flex' }}>
        {/* -- Question value -- */}

        {!store.embedded
          ? usedCluesObj.map((clObj) => (
              <Box className={styles.questionValueCard}>
                <Box>
                  <Text
                    size="md"
                    sx={(theme) => ({
                      color: theme.colors.fatic01,
                    })}
                  >
                    {clObj.points}
                  </Text>
                </Box>
                <Text size="xs" color="primary">
                  {t('clueN', { number: clObj.index + 1 })}
                </Text>
              </Box>
            ))
          : null}

        {!store.embedded ? (
          <Box className={styles.questionValueCard}>
            <Box>
              <Text
                size="md"
                sx={(theme) => ({
                  color: store.viewMode
                    ? colorByStatus[store.questionResponses[question.id].status]
                    : theme.colors.fatic02,
                })}
              >
                {store.viewMode
                  ? store.questionResponses[question.id].points
                  : (store.questionsInfo.perQuestion - clueLessPoints).toFixed(2)}
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
