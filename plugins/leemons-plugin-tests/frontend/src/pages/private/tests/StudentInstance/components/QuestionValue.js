import React from 'react';
import PropTypes from 'prop-types';
import { Box, COLORS, Select, Text } from '@bubbles-ui/components';
import { forEach, isArray, keyBy } from 'lodash';
import { getQuestionClues } from '../helpers/getQuestionClues';

export default function QuestionValue(props) {
  const { styles, cx, t, store, render, question, saveQuestion } = props;

  const usedClues = store.questionResponses?.[question.id].clues;
  const usedCluesTypes = store.questionResponses?.[question.id].cluesTypes;
  const clues = React.useMemo(
    () => getQuestionClues(question, usedCluesTypes || null, store.config),
    [question]
  );
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

  function useClue(type) {
    if (!store.viewMode) {
      if (clues.length > store.questionResponses[question.id].clues) {
        store.questionResponses[question.id].clues += 1;
        if (!isArray(store.questionResponses[question.id].cluesTypes)) {
          store.questionResponses[question.id].cluesTypes = [];
        }
        if (store.questionResponses[question.id].cluesTypes.indexOf(type) === -1) {
          store.questionResponses[question.id].cluesTypes.push(type);
        }
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

  const selectData = [];
  if (clues?.length) {
    forEach(clues, (clue) => {
      const lessPoints =
        store.questionsInfo.perQuestion * (cluesConfigByType[clue.type].value / 100);
      selectData.push({
        label: `${t(`clue${clue.type}`)} (-${lessPoints.toFixed(2)} ${t('pts')})`,
        value: clue.type,
        disabled: usedCluesTypes?.indexOf(clue.type) >= 0,
      });
    });
  }

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.other.divider.background.color.default}`,
        paddingBottom: theme.spacing[4],
        marginBottom: theme.spacing[4],
      })}
    >
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        {/* -- Question value -- */}

        {!store.embedded ? (
          <Box>
            <Text
              strong
              sx={(theme) => ({
                color: store.viewMode
                  ? colorByStatus[store.questionResponses[question.id].status]
                  : theme.colors.fatic02,
              })}
            >
              +
              {store.viewMode
                ? store.questionResponses[question.id].points
                : (store.questionsInfo.perQuestion - clueLessPoints).toFixed(2)}
            </Text>{' '}
            <Text size="xs" color="primary">
              {t('pointsInTotal')}
            </Text>
          </Box>
        ) : null}

        {!store.embedded
          ? usedCluesObj.map((clObj) => (
              <>
                <Box
                  sx={(theme) => ({
                    width: 1,
                    height: 26,
                    backgroundColor: theme.other.divider.background.color.default,
                    marginLeft: theme.spacing[4],
                    marginRight: theme.spacing[4],
                  })}
                />
                <Box>
                  <Text
                    strong
                    sx={(theme) => ({
                      color: theme.colors.fatic01,
                    })}
                  >
                    {clObj.points}
                  </Text>{' '}
                  <Text size="xs" color="primary">
                    {t('clueN', { number: clObj.index + 1 })}
                  </Text>
                </Box>
              </>
            ))
          : null}
      </Box>
      {/* -- Question clues -- */}
      {clues.length ? (
        <>
          {selectData?.length ? (
            <Select
              style={{ width: 200 }}
              placeholder={t('askForAHint')}
              data={selectData}
              onChange={useClue}
            />
          ) : null}
          {/* <Box className={cx(styles.questionValueCard, styles.questionCluesCard)}>


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
          */}
        </>
      ) : null}
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
