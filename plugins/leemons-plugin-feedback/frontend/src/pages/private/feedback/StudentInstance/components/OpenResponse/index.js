import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Textarea } from '@bubbles-ui/components';
import QuestionButtons from '../questions/QuestionButtons';

const OpenResponse = (props) => {
  const { t, question, defaultValue } = props;
  const [responseValue, setResponseValue] = useState('');

  React.useEffect(() => {
    setResponseValue(defaultValue);
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
        value={responseValue}
        onChange={setResponseValue}
      />
      <QuestionButtons {...props} value={responseValue} />
    </Box>
  );
};

OpenResponse.propTypes = {
  t: PropTypes.func,
  question: PropTypes.any,
  defaultValue: PropTypes.any,
};

export default OpenResponse;
