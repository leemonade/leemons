import React from 'react';
import PropTypes from 'prop-types';
import { Box, Textarea } from '@bubbles-ui/components';
import QuestionButtons from '../questions/QuestionButtons';

const OpenResponse = (props) => {
  const { t, question, defaultValue, setCurrentValue, currentValue } = props;

  React.useEffect(() => {
    setCurrentValue(defaultValue);
  }, [defaultValue, question]);

  return (
    <Box>
      <Textarea
        placeholder={t('openResponsePlaceholder')}
        maxLength={question.properties.maxCharacters}
        counter={'char'}
        showCounter
        counterLabels={{}}
        minRows={5}
        value={currentValue}
        onChange={setCurrentValue}
      />
      {/* <QuestionButtons {...props} value={currentValue} /> */}
    </Box>
  );
};

OpenResponse.propTypes = {
  t: PropTypes.func,
  question: PropTypes.any,
  defaultValue: PropTypes.any,
  setCurrentValue: PropTypes.func,
  currentValue: PropTypes.any,
};

export default OpenResponse;
