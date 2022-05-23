import React from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader, Text } from '@bubbles-ui/components';
import { LeebraryImage } from '@leebrary/components';
import { numberToEncodedLetter } from '@common';
import { find } from 'lodash';
import { getQuestionClues } from '../../../helpers/getQuestionClues';

export default function Responses(props) {
  const { styles, question, store, render, cx } = props;

  const currentResponseIndex = store.questionResponses[question.id].properties?.response;

  const clue = React.useMemo(
    () =>
      find(getQuestionClues(question, store.questionResponses[question.id].clues), {
        type: 'hide-response',
      }),
    [question, store.questionResponses[question.id].clues]
  );

  if (clue && clue.indexs.includes(currentResponseIndex)) {
    store.questionResponses[question.id].properties.response = null;
    render();
  }

  async function markResponse(index) {
    if (!store.questionResponses[question.id].properties) {
      store.questionResponses[question.id].properties = {};
    }
    if (store.questionResponses[question.id].properties.response === index) {
      delete store.questionResponses[question.id].properties.response;
    } else {
      store.questionResponses[question.id].properties.response = index;
    }

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

    let iconToShow = null;
    if (store.viewMode) {
      classContainer = cx(classContainer, styles.questionResponseImageContainerViewMode);
      if (question.withImages) {
        classContainer = cx(
          classContainer,
          styles.questionResponseImageContainerViewModeWithImages
        );
      }
      if (response.isCorrectResponse) {
        iconToShow = '/public/tests/question-done.svg';
        classContainer = cx(classContainer, styles.questionResponseImageContainerDone);
      } else if (index === currentResponseIndex) {
        iconToShow = '/public/tests/question-wrong.svg';
        classContainer = cx(classContainer, styles.questionResponseImageContainerWrong);
      }
    }

    return (
      <Box
        key={index}
        className={classContainer}
        onClick={() => {
          if (!clued && !store.viewMode) {
            markResponse(index);
          }
        }}
      >
        {iconToShow ? (
          <Box className={styles.questionViewModeIcon}>
            <ImageLoader src={iconToShow} />
          </Box>
        ) : null}

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
