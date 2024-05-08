import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Textarea } from '@bubbles-ui/components';

const OpenResponse = (props) => {
  const { t, question, defaultValue } = props;
  const [responseValue, setResponseValue] = useState('');

  React.useEffect(() => {
    setResponseValue(defaultValue);
  }, [defaultValue, question]);

  useEffect(() => {
    props?.setCurrentValue(responseValue);
  }, [responseValue]);

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
    </Box>
  );
};

OpenResponse.propTypes = {
  t: PropTypes.func,
  question: PropTypes.any,
  defaultValue: PropTypes.any,
  setCurrentValue: PropTypes.func,
};

export default OpenResponse;
