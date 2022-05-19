import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { getQuestionClues } from '../../../helpers/getQuestionClues';

export default function Responses(props) {
  const { styles, question, store, render, cx } = props;

  const currentResponses = store.questionResponses[question.id].properties?.responses;

  const clue = React.useMemo(
    () =>
      find(getQuestionClues(question, store.questionResponses[question.id].clues), {
        type: 'hide-response',
      }),
    [question, store.questionResponses[question.id].clues]
  );

  return null;

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
