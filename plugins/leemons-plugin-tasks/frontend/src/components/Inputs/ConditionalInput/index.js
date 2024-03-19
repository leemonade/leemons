import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Stack, PageContainer } from '@bubbles-ui/components';
import { ConditionalInputStyles } from './ConditionalInput.styles';

export default function ConditionalInput({
  showOnTrue = true,
  render,
  helpPosition = 'bottom',
  onChange,
  initialValue,
  value: userValue,
  ...props
}) {
  const { classes } = ConditionalInputStyles();
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
    <Stack direction="column" spacing={1}>
      <Switch {...props} helpPosition={helpPosition} checked={show} onChange={handleChange} />

      {showOnTrue === show && <PageContainer className={classes.root}>{render()}</PageContainer>}
    </Stack>
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
