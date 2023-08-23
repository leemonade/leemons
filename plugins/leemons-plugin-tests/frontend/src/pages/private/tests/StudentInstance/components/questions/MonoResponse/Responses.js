import React from 'react';
import PropTypes from 'prop-types';
import { Box, HtmlText, ImageLoader, Stack, Text } from '@bubbles-ui/components';
import { LeebraryImage } from '@leebrary/components';
import { numberToEncodedLetter } from '@common';
import { find } from 'lodash';
import { getQuestionClues } from '../../../helpers/getQuestionClues';
import { htmlToText } from '../../../helpers/htmlToText';

export default function Responses(props) {
  const { styles, question, store, render, cx, t } = props;

  const currentResponseIndex = store.questionResponses?.[question.id].properties?.response;

  const clue = React.useMemo(
    () =>
      find(getQuestionClues(question, store.questionResponses?.[question.id].clues, store.config), {
        type: 'hide-response',
      }),
    [question, store.questionResponses?.[question.id].clues]
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

    let classExplanation = styles.textExplanation;
    let explanation = null;
    let iconToShow = null;
    if (store.viewMode) {
      classContainer = cx(classContainer, styles.questionResponseImageContainerViewMode);

      if (question.properties.explanationInResponses) {
        const text = htmlToText(response.explanation);
        if (text) explanation = response.explanation;
      } else if (response.isCorrectResponse) {
        const text = htmlToText(question.properties.explanation);
        if (text) explanation = question.properties.explanation;
      }

      if (question.withImages) {
        classContainer = cx(
          classContainer,
          styles.questionResponseImageContainerViewModeWithImages
        );
        classExplanation = cx(classExplanation, styles.textExplanationViewMode);
      }
      if (response.isCorrectResponse) {
        iconToShow = '/public/tests/question-done.svg';
        classContainer = cx(classContainer, styles.questionResponseImageContainerDone);
      } else if (index === currentResponseIndex) {
        iconToShow = '/public/tests/question-wrong.svg';
        classContainer = cx(classContainer, styles.questionResponseImageContainerWrong);
      } else {
        classContainer = cx(classContainer, styles.questionResponseRemovePadding);
        classExplanation = cx(classExplanation, styles.textExplanationRemovePadding);
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
            <Box
              className={
                store.viewMode
                  ? styles.questionResponseImageContentViewMode
                  : styles.questionResponseImageContent
              }
            >
              <LeebraryImage className={styles.questionResponseImage} src={response.image} />
            </Box>
            <Box
              className={
                store.viewMode
                  ? styles.questionResponseImageTextContentViewMode
                  : styles.questionResponseImageTextContent
              }
            >
              {response.imageDescription ? (
                <Text color="primary" role="productive" size="md">
                  {response.imageDescription}
                </Text>
              ) : null}
              {explanation ? (
                <Box className={classExplanation}>
                  <Box sx={(theme) => ({ paddingBottom: theme.spacing[3] })}>
                    <Text role="productive" size="xs" color="primary">
                      {response.isCorrectResponse
                        ? t('correctResponse').toUpperCase()
                        : t('explanation').toUpperCase()}
                    </Text>
                  </Box>
                  <HtmlText>{explanation}</HtmlText>
                </Box>
              ) : null}
            </Box>
          </>
        ) : (
          <Box>
            <Stack fullWidth>
              {numberToEncodedLetter(index + 1)}.
              <Box sx={(theme) => ({ paddingLeft: theme.spacing[1] })}>{response.response}</Box>
            </Stack>
            {explanation ? (
              <Box className={classExplanation}>
                <Box sx={(theme) => ({ paddingBottom: theme.spacing[3] })}>
                  <Text role="productive" size="xs" color="primary">
                    {response.isCorrectResponse
                      ? t('correctResponse').toUpperCase()
                      : t('explanation').toUpperCase()}
                  </Text>
                </Box>
                <HtmlText>{explanation}</HtmlText>
              </Box>
            ) : null}
          </Box>
        )}
      </Box>
    );
  });

  let className = question.withImages
    ? styles.questionResponsesContainerImages
    : styles.questionResponsesContainer;

  if (store.viewMode) {
    className = cx(className, styles.questionResponsesContainerViewMode);
  }

  return <Box className={className}>{components}</Box>;
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
