import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Text, COLORS } from '@bubbles-ui/components';
import QuestionButtons from '../questions/QuestionButtons';
import NetPromoterScoreResponseStyles from './NetPromoterScoreResponse.styles';

const NetPromoterScoreResponse = (props) => {
  const { question } = props;
  const [selectedValue, setSelectedValue] = useState('');
  const { classes } = NetPromoterScoreResponseStyles({}, { name: 'NetPromoterScoreResponse' });

  const renderNumbers = () => {
    const numberElements = [];
    for (let i = 1; i <= 10; i++) {
      numberElements.push(
        <Box>
          <Box
            className={classes.numberElement}
            style={
              i === selectedValue
                ? {
                    border: `1px solid ${COLORS.interactive01d}`,
                    backgroundColor: COLORS.interactive01v1,
                  }
                : {}
            }
            onClick={() => setSelectedValue(i)}
          >
            <Text color="primary" role="productive">
              {i}
            </Text>
          </Box>
        </Box>
      );
    }
    return numberElements;
  };
  return (
    <Box>
      <Stack fullWidth spacing={1}>
        {renderNumbers()}
      </Stack>
      <Stack style={{ marginTop: 6 }} fullWidth justifyContent="space-between">
        <Text color="primary" role="productive" strong>
          {question.properties.notLikely}
        </Text>
        <Text color="primary" role="productive" strong>
          {question.properties.veryLikely}
        </Text>
      </Stack>
      <QuestionButtons {...props} value={selectedValue} />
    </Box>
  );
};

NetPromoterScoreResponse.propTypes = {
  t: PropTypes.func,
  question: PropTypes.any,
};

export default NetPromoterScoreResponse;
