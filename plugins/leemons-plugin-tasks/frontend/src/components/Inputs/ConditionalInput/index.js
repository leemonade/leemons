import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, ContextContainer, PageContainer } from '@bubbles-ui/components';

export default function ConditionalInput({
  showOnTrue = true,
  render,
  helpPosition = 'bottom',
  onChange,
  initialValue,
  value: userValue,
  ...props
}) {
  const isFirstRender = React.useRef(true);
  const [show, setShow] = useState(userValue || false);

  const handleChange = (value) => {
    if (value !== undefined) {
      setShow(value);
      if (typeof onChange === 'function') {
        onChange(value);
      }
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      handleChange(initialValue);
    }

    handleChange(userValue);
  }, [userValue]);

  return (
    <ContextContainer>
      <Switch {...props} helpPosition={helpPosition} checked={show} onChange={handleChange} />

      {showOnTrue === show && <PageContainer>{render()}</PageContainer>}
    </ContextContainer>
  );
}

ConditionalInput.propTypes = {
  showOnTrue: PropTypes.bool,
  render: PropTypes.func,
  helpPosition: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.bool,
  initialValue: PropTypes.bool,
};
