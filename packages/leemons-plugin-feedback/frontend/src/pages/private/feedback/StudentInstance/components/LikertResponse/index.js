import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Text } from '@bubbles-ui/components';
import QuestionButtons from '../questions/QuestionButtons';
import LikertResponseStyles from './LikertResponse.styles';

const LikertResponse = (props) => {
  const { question, defaultValue } = props;
  const [selectedValue, setSelectedValue] = useState(null);
  const { classes } = LikertResponseStyles({}, { name: 'LikertResponse' });

  const getLabelPosition = (index, maxLabels) => {
    if (index === 0) return 'flex-start';
    if (index === maxLabels - 1) return 'flex-end';
    return 'center';
  };

  const handleSelectValue = (value) => {
    if (value !== selectedValue) setSelectedValue(value);
    else if (value === selectedValue) setSelectedValue(null);
  };

  const renderNumbers = () => {
    const { maxLabels } = question.properties;
    const numberElements = [];
    for (let i = 0; i < maxLabels; i++) {
      numberElements.push(
        <Box>
          <Box
            className={classes.numberElement}
            sx={(theme) =>
              i === selectedValue
                ? {
                    border: `1px solid ${theme.colors.interactive01d}`,
                    backgroundColor: theme.colors.interactive01v1,
                  }
                : {}
            }
            onClick={() => handleSelectValue(i)}
          >
            <Text color="primary" role="productive">
              {i + 1}
            </Text>
          </Box>
          <Stack style={{ marginTop: 6 }} fullWidth justifyContent={getLabelPosition(i, maxLabels)}>
            <Text color="primary" role="productive" className={classes.likertLabel}>
              {question.properties[`likertLabel${i}`]}
            </Text>
          </Stack>
        </Box>
      );
    }
    return numberElements;
  };

  React.useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue, question]);

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
  defaultValue: PropTypes.any,
};

export default LikertResponse;
