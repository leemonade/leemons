import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Text } from '@bubbles-ui/components';
import QuestionButtons from '../questions/QuestionButtons';
import NetPromoterScoreResponseStyles from './NetPromoterScoreResponse.styles';

const NetPromoterScoreResponse = (props) => {
  const { question, defaultValue } = props;
  const [selectedValue, setSelectedValue] = useState('');
  const { classes } = NetPromoterScoreResponseStyles({}, { name: 'NetPromoterScoreResponse' });

  const renderNumbers = () => {
    const numberElements = [];
    for (let i = 0; i < 11; i++) {
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

  React.useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue, question]);

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
  defaultValue: PropTypes.any,
};

export default NetPromoterScoreResponse;
