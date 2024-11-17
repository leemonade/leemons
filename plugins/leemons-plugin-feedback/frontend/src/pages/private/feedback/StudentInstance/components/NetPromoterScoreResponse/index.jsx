import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Text } from '@bubbles-ui/components';
import NetPromoterScoreResponseStyles from './NetPromoterScoreResponse.styles';

const NetPromoterScoreResponse = (props) => {
  const { question, defaultValue } = props;
  const [selectedValue, setSelectedValue] = useState('');
  const { classes } = NetPromoterScoreResponseStyles({}, { name: 'NetPromoterScoreResponse' });

  const handleSelectValue = (value) => {
    if (value !== selectedValue) setSelectedValue(value);
    else if (value === selectedValue) setSelectedValue(null);
  };

  const renderNumbers = () => {
    const numberElements = [];
    for (let i = 0; i < 11; i++) {
      const isSelected = selectedValue === i;
      numberElements.push(
        <Box>
          <Box
            className={isSelected ? classes.selectedNumberElement : classes.numberElement}
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
              {i}
            </Text>
          </Box>
        </Box>
      );
    }
    return numberElements;
  };

  React.useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue, question]);

  useEffect(() => {
    props?.setCurrentValue(selectedValue);
  }, [selectedValue]);

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
    </Box>
  );
};

NetPromoterScoreResponse.propTypes = {
  t: PropTypes.func,
  question: PropTypes.any,
  defaultValue: PropTypes.any,
  setCurrentValue: PropTypes.func,
};

export default NetPromoterScoreResponse;
