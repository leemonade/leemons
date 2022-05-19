import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from '@bubbles-ui/components';
import { LeebraryImage } from '@leebrary/components';
import { numberToEncodedLetter } from '@common';

export default function Responses(props) {
  const { styles, question, store, render, cx } = props;

  const currentResponseIndex = store.questionResponses[question.id].properties?.response;

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
