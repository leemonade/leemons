import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, Button } from '@bubbles-ui/components';

export default function PreTaskStep({ onNext }) {
  return (
    <ContextContainer title="Pretask">
      <p>Aquí iría la info del Pretask</p>
      <Button onClick={onNext}>Next</Button>
    </ContextContainer>
  );
}

PreTaskStep.propTypes = {
  onNext: PropTypes.func.isRequired,
};
