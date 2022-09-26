import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Text, COLORS } from '@bubbles-ui/components';
import QuestionButtons from '../questions/QuestionButtons';
import LikertResponseStyles from './LikertResponse.styles';

const LikertResponse = (props) => {
  const { question } = props;
  const [selectedValue, setSelectedValue] = useState(null);
  const { classes } = LikertResponseStyles({}, { name: 'LikertResponse' });

  const getLabelPosition = (index, maxLabels) => {
    if (index === 1) return 'flex-start';
    if (index === maxLabels) return 'flex-end';
    return 'center';
  };

  const renderNumbers = () => {
    const { maxLabels } = question.properties;
    const numberElements = [];
    for (let i = 1; i <= maxLabels; i++) {
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
          <Stack style={{ marginTop: 6 }} fullWidth justifyContent={getLabelPosition(i, maxLabels)}>
            <Text color="primary" role="productive" className={classes.likertLabel}>
              {question.properties[`likertLabel${i - 1}`]}
            </Text>
          </Stack>
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
      <QuestionButtons {...props} value={selectedValue} />
    </Box>
  );
};

LikertResponse.propTypes = {
  t: PropTypes.func,
  question: PropTypes.any,
};

export default LikertResponse;
