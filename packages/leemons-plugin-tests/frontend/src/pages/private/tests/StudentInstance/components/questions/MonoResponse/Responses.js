import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@bubbles-ui/components';
import { LeebraryImage } from '@leebrary/components';
import { numberToEncodedLetter } from '@common';
import { find } from 'lodash';
import { getQuestionClues } from '../../../helpers/getQuestionClues';

export default function Responses(props) {
  const { styles, question, store, render, cx } = props;

  const currentResponseIndex = store.questionResponses[question.id].properties?.response;

  let clue = React.useMemo(
    () =>
      find(getQuestionClues(question, store.questionResponses[question.id].clues), {
        type: 'hide-response',
      }),
    [question, store.questionResponses[question.id].clues]
  );

  clue = {
    indexs: [1],
  };

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
    return (
      <Box key={index} className={classContainer} onClick={() => markResponse(index)}>
        {clue && clue.indexs.includes(index) ? (
          <Box className={styles.disableResponse}>
            <Text className={styles.questionResponseImageClueText}>
              {numberToEncodedLetter(index + 1)}
            </Text>
          </Box>
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
