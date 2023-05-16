import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Text } from '@bubbles-ui/components';
import { LeebraryImage } from '@leebrary/components';
import SelectResponseStyles from './SelectResponse.styles';

export default function OpenResponse(props) {
  const { responses, question } = props;
  const { classes } = SelectResponseStyles({}, { name: 'SelectResponse' });

  const renderQuestions = () => {
    const { withImages } = question.properties;
    const questions = question.properties.responses.map(({ value }, index) => {
      const responseValue = withImages ? value.imageDescription : value.response;
      const isLast = index === question.properties.responses.length - 1;

      return (
        <Box key={index} className={classes.question} style={{ marginBottom: !isLast && 40 }}>
          {withImages && <LeebraryImage src={value.image.id} className={classes.questionImage} />}
          <Box style={{ width: '100%' }}>
            <Stack fullWidth alignItems="flex-end" skipFlex>
              <Text role="productive" color="primary" style={{ display: 'block', flex: 1 }}>
                {responseValue}
              </Text>
              <Stack skipFlex spacing={6} alignItems="flex-end">
                <Text color="quartiary">{responses.value?.[index] || 0} resp.</Text>
                <Text color="quartiary" size="md" strong>
                  {Math.trunc(responses.percentages?.[index] || 0)}%
                </Text>
              </Stack>
            </Stack>
            <Stack fullWidth className={classes.percentageBarContainer} skipFlex>
              <Box
                skipFlex
                className={classes.percentageBar}
                style={{
                  width: `${responses.percentages?.[index] || 0}%`,
                }}
              />
            </Stack>
          </Box>
        </Box>
      );
    });
    return questions;
  };

  return (
    <Stack spacing={2} direction="column" fullWidth>
      <Stack fullWidth direction="column" className={classes.container}>
        {renderQuestions()}
      </Stack>
    </Stack>
  );
}

OpenResponse.propTypes = {
  responses: PropTypes.any,
  question: PropTypes.any,
};
