/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader, Select, Stack, Text } from '@bubbles-ui/components';
import { cloneDeep, find, forEach, isArray, isNil, isNumber, isObject, shuffle } from 'lodash';
import { numberToEncodedLetter } from '@common';
import { getQuestionClues } from '../../../helpers/getQuestionClues';

export default function Responses(props) {
  const { styles, question, store, render, t, cx } = props;

  const currentResponses = store.questionResponses[question.id].properties?.responses || [];

  const clue = React.useMemo(
    () =>
      find(getQuestionClues(question, store.questionResponses[question.id].clues, store.config), {
        type: 'hide-response',
      }),
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
  forEach(question.properties.markers.list, ({ response }, index) => {
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

  const components = question.properties.markers.list.map((response, index) => {
    const [select, ...selectData] = cloneDeep(data);
    if (!isNil(store.questionResponses[question.id].properties?.responses[index])) {
      selectData.push({
        value: store.questionResponses[question.id].properties.responses[index],
        label:
          question.properties.markers.list[
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
              {question.properties.markers.type === 'letter'
                ? numberToEncodedLetter(index + 1)
                : index + 1}
            </Text>
          </Box>

          {clued ? (
            <Box className={cx(styles.mapViewContent, styles.mapViewContentClue)}>
              {question.properties.markers.list[index].response}
              <Box className={styles.mapViewIcon}>
                <ImageLoader src={`/public/tests/clue-on.svg`} />
              </Box>
            </Box>
          ) : isDone ? (
            <Box className={cx(styles.mapViewContent, styles.mapViewContentDone)}>
              {question.properties.markers.list[currentValue].response}
              <Box className={styles.mapViewIcon}>
                <ImageLoader src={`/public/tests/question-done.svg`} />
              </Box>
            </Box>
          ) : (
            <Stack fullWidth spacing={2} style={{ width: 'calc(100% - 50%)' }}>
              <Box className={cx(styles.mapViewContent, styles.mapViewContentError)}>
                {currentValue === '-'
                  ? t('selectResponse')
                  : question.properties.markers.list[currentValue].response}
                <Box className={styles.mapViewIcon}>
                  <ImageLoader src={`/public/tests/question-wrong.svg`} />
                </Box>
              </Box>
              <Box className={cx(styles.mapViewContent, styles.mapViewContentDone)}>
                {question.properties.markers.list[index].response}
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
            {question.properties.markers.type === 'letter'
              ? numberToEncodedLetter(index + 1)
              : index + 1}
          </Text>
        </Box>
        <Box className={styles.mapResponsesSelect}>
          {clued ? (
            <>
              <Box className={styles.disableResponseBg} />
              <Box
                className={cx(styles.disableResponseIcon, styles.disableResponseIconWithOutImage)}
              >
                <ImageLoader src={`/public/tests/clue-on.svg`} />
              </Box>
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

  /*
  if (clue && clue.indexs.includes(currentResponseIndex)) {
    store.questionResponses[question.id].properties.response = null;
    render();
  }

  async function markResponse(index) {
    if (!store.questionResponses[question.id].properties) {
      store.questionResponses[question.id].properties = {};
    }
    store.questionResponses[question.id].properties.response = index;
    render();
  }

  const components = question.properties.responses.map(({ value: response }, index) => {
    let classContainer = styles.questionResponseImageContainer;
    if (index === currentResponseIndex) {
      classContainer = cx(classContainer, styles.questionResponseImageContainerSelected);
    }
    let classDisableBg = styles.disableResponseBg;
    let classDisableIcon = styles.disableResponseIcon;
    if (!question.withImages) {
      classDisableBg = cx(classDisableBg, styles.disableResponseBgWithOutImage);
      classDisableIcon = cx(classDisableIcon, styles.disableResponseIconWithOutImage);
    }
    const clued = clue && clue.indexs.includes(index);
    if (clued) {
      classContainer = cx(classContainer, styles.questionResponseImageContainerClued);
    }
    return (
      <Box
        key={index}
        className={classContainer}
        onClick={() => {
          if (!clued) {
            markResponse(index);
          }
        }}
      >
        {clued ? (
          <>
            <Box className={classDisableBg} />
            <Box className={classDisableIcon}>
              <ImageLoader src={`/public/tests/clue-on.svg`} />
            </Box>
            {question.withImages ? (
              <Box className={styles.disableResponseImage}>
                <ImageLoader src={`/public/tests/hint-image.svg`} />
              </Box>
            ) : null}
          </>
        ) : null}

        {question.withImages ? (
          <>
            <Box className={styles.questionResponseImageContent}>
              <LeebraryImage className={styles.questionResponseImage} src={response.image} />
            </Box>
            <Box className={styles.questionResponseImageTextContent}>
              {response.image?.description ? (
                <Text color="primary" role="productive" size="md">
                  {response.image.description}
                </Text>
              ) : null}
            </Box>
          </>
        ) : (
          <Box>
            {numberToEncodedLetter(index + 1)}. {response.response}{' '}
          </Box>
        )}
      </Box>
    );
  });

  return (
    <Box
      className={
        question.withImages
          ? styles.questionResponsesContainerImages
          : styles.questionResponsesContainer
      }
    >
      {components}
    </Box>
  );

   */
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
