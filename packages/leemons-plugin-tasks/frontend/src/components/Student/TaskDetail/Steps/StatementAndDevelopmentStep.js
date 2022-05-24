import React from 'react';
import PropTypes from 'prop-types';

import { ContextContainer, HtmlText } from '@bubbles-ui/components';

export default function DevelopmentStep({ assignation }) {
  const { development } = assignation?.instance?.assignable;

  return (
    <ContextContainer>
      <ContextContainer title="Development">
        <HtmlText>{development}</HtmlText>
      </ContextContainer>
    </ContextContainer>
  );
}

DevelopmentStep.propTypes = {
  id: PropTypes.string.isRequired,
  student: PropTypes.string.isRequired,
  instance: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};
