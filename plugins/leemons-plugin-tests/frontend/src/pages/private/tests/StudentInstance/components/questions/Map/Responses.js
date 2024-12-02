/* eslint-disable no-nested-ternary */
import React from 'react';

import { Box, ImageLoader, Select, Stack, Text } from '@bubbles-ui/components';
import { numberToEncodedLetter } from '@common';
import { cloneDeep, find, forEach, isArray, isNil, isNumber, isObject, shuffle } from 'lodash';
import PropTypes from 'prop-types';

import { getQuestionClues } from '../../../helpers/getQuestionClues';

export default function Responses(props) {
  const { styles, question, store, render, t, cx } = props;

  const currentResponses = store.questionResponses[question.id].properties?.responses || [];

  const clue = React.useMemo(
    () =>
      find(
        getQuestionClues(question, store.questionResponses[question.id].cluesTypes, store.config),
        {
          type: 'hide-response',
        }
      ),
    [question, store.questionResponses[question.id].clues]
  );

  function addPropertiesIfNotExists() {
    if (!isObject(store.questionResponses[question.id].properties)) {
      store.questionResponses[question.id].properties = {};
    }
    if (!isArray(store.questionResponses[question.id].properties.responses)) {
      store.questionResponses[question.id].properties.responses = [];
    }
  }

  if (clue) {
    let valuesOk = true;
    forEach(clue.indexs, (index) => {
      if (currentResponses[index] !== index) {
        valuesOk = false;
        return false;
      }
    });
    if (!valuesOk) {
      addPropertiesIfNotExists();
      forEach(clue.indexs, (index) => {
        store.questionResponses[question.id].properties.responses[index] = index;
      });
      render();
    }
  }

  const data = [{ value: '-', label: t('selectResponse') }];
  forEach(question.mapProperties.markers.list, ({ response }, index) => {
    if (!currentResponses.includes(index)) {
      data.push({
        value: index,
        label: response,
      });
    }
  });

  function onSelectChange(value, index) {
    addPropertiesIfNotExists();
    if (value !== '-') {
      store.questionResponses[question.id].properties.responses[index] = Number(value);
    } else {
      delete store.questionResponses[question.id].properties.responses[index];
    }
    render();
  }

  const components = question.mapProperties.markers.list.map((response, index) => {
    const [select, ...selectData] = cloneDeep(data);
    if (!isNil(store.questionResponses[question.id].properties?.responses[index])) {
      selectData.push({
        value: store.questionResponses[question.id].properties.responses[index],
        label:
          question.mapProperties.markers.list[
            store.questionResponses[question.id].properties.responses[index]
          ].response,
      });
    }

    let clued = false;
    if (clue) {
      clued = clue.indexs.includes(index);
    }

    const currentValue = isNumber(store.questionResponses[question.id].properties?.responses[index])
      ? store.questionResponses[question.id].properties.responses[index]
      : '-';

    if (store.viewMode) {
      const isDone = currentValue === index;

      return (
        <Box key={index} className={styles.mapResponsesContent}>
          <Box className={styles.mapResponsesNumber}>
            <Text size="md" role="productive" strong>
              {question.mapProperties.markers.type === 'letter'
                ? numberToEncodedLetter(index + 1)
                : index + 1}
            </Text>
          </Box>
          {clued ? (
            <Box className={cx(styles.mapViewContent, styles.mapViewContentClue)}>
              {question.mapProperties.markers.list[index].response}
              <Box className={styles.mapViewIcon}>
                <ImageLoader src={`/public/tests/clue-on.svg`} />
              </Box>
            </Box>
          ) : isDone ? (
            <Box className={cx(styles.mapViewContent, styles.mapViewContentDone)}>
              {question.mapProperties.markers.list[currentValue].response}
              <Box className={styles.mapViewIcon}>
                <ImageLoader src={`/public/tests/question-done.svg`} />
              </Box>
            </Box>
          ) : (
            <Stack fullWidth spacing={2} style={{ width: 'calc(100% - 50%)' }}>
              <Box className={cx(styles.mapViewContent, styles.mapViewContentError)}>
                {currentValue === '-'
                  ? t('selectResponse')
                  : question.mapProperties.markers.list[currentValue].response}
                <Box className={styles.mapViewIcon}>
                  <ImageLoader src={`/public/tests/question-wrong.svg`} />
                </Box>
              </Box>
              <Box className={cx(styles.mapViewContent, styles.mapViewContentDone)}>
                {question.mapProperties.markers.list[index].response}
              </Box>
            </Stack>
          )}
        </Box>
      );
    }

    return (
      <Box key={index} className={styles.mapResponsesContent}>
        <Box className={styles.mapResponsesNumber}>
          <Text size="md" role="productive" strong>
            {question.mapProperties.markers.type === 'letter'
              ? numberToEncodedLetter(index + 1)
              : index + 1}
          </Text>
        </Box>
        <Box className={styles.mapResponsesSelect}>
          {clued ? (
            <>
              <Box className={styles.disableResponseBg} />
            </>
          ) : null}
          <Select
            placeholder={t('selectResponse')}
            value={currentValue}
            data={[select, ...shuffle(selectData)]}
            onChange={(e) => onSelectChange(e, index)}
          />
        </Box>
      </Box>
    );
  });

  return <Box className={styles.mapResponsesContainer}>{components}</Box>;
}

Responses.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  render: PropTypes.func,
};
