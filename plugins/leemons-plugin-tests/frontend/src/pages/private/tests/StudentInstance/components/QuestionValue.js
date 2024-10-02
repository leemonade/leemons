import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, COLORS, Select, Text } from '@bubbles-ui/components';
import { forEach, isArray, keyBy } from 'lodash';
import { getQuestionClues } from '../helpers/getQuestionClues';

export default function QuestionValue(props) {
  const [selectedClue, setSelectedClue] = useState(null);
  const { t, store, render, question, saveQuestion, isPreviewMode = false } = props;

  const usedClues = store.questionResponses?.[question.id].clues;
  const usedCluesTypes = store.questionResponses?.[question.id].cluesTypes;
  const clues = useMemo(
    () => getQuestionClues(question, usedCluesTypes || null, store.config),
    [question]
  );

  useEffect(() => {
    setSelectedClue(null); // Resetea el valor seleccionado al cambiar de pregunta
  }, [question.id]); // Dependencia en el ID de la pregunta
  const cluesConfigByType = React.useMemo(
    () => keyBy(store.config.clues, 'type'),
    [store.config.clues]
  );
  let clueLessPoints = 0;
  const usedCluesObj = [];

  forEach(clues, (clue, index) => {
    if (index < usedClues) {
      const lessPoints =
        store?.questionsInfo?.perQuestion * (cluesConfigByType[clue.type].value / 100);
      usedCluesObj.push({
        points: `-${lessPoints.toFixed(2)}`,
        index,
      });
      clueLessPoints += lessPoints;
    }
  });

  function handleUseClue(type) {
    if (!store.viewMode) {
      const usedCluesAmount = store.questionResponses[question.id].clues;
      if (clues.length > usedCluesAmount) {
        store.questionResponses[question.id].clues += 1;
        if (!isArray(store.questionResponses[question.id].cluesTypes)) {
          store.questionResponses[question.id].cluesTypes = [];
        }

        const clueTypeNotUsedYet =
          store.questionResponses[question.id].cluesTypes.indexOf(type) === -1;
        if (clueTypeNotUsedYet) {
          store.questionResponses[question.id].cluesTypes.push(type);

          if (type === 'hide-response') {
            const questionIndex = store.questions.findIndex((q) => q.id === question.id);
            if (questionIndex !== -1 && store.questions[questionIndex].mapProperties) {
              store.questions[questionIndex].mapProperties.markers.canShowHintMarker = true;
            }
          }
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
      const clueType = `clue${clue.type}`;
      const lessPoints =
        store?.questionsInfo?.perQuestion * (cluesConfigByType[clue.type].value / 100);
      selectData.push({
        label: `${t(clueType)} (-${lessPoints.toFixed(2)} ${t('pts')})`,
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
        paddingBottom: !isPreviewMode ? theme.spacing[4] : 0,
        marginBottom: !isPreviewMode ? theme.spacing[4] : 0,
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
                : (store?.questionsInfo?.perQuestion - clueLessPoints).toFixed(2)}
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
      {clues.length && !isPreviewMode ? (
        <>
          {selectData?.length ? (
            <Select
              style={{ width: 200 }}
              placeholder={t('askForAHint')}
              data={selectData}
              value={selectedClue}
              onChange={(value) => {
                handleUseClue(value);
                setSelectedClue(value); // Actualiza el estado local al seleccionar una nueva opción
              }}
            />
          ) : null}
        </>
      ) : null}
    </Box>
  );
}

QuestionValue.propTypes = {
  t: PropTypes.any,
  question: PropTypes.any,
  store: PropTypes.any,
  render: PropTypes.func,
  saveQuestion: PropTypes.func,
};
