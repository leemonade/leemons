import React from 'react';
import PropTypes from 'prop-types';

import { ContextContainer, HtmlText } from '@bubbles-ui/components';

export default function StatementAndDevelopmentStep({ assignation, showDevelopment }) {
  const { statement, development } = assignation?.instance?.assignable;

  return (
    <ContextContainer>
      <ContextContainer title="Statement">
        <HtmlText>{statement}</HtmlText>
      </ContextContainer>
      {showDevelopment && (
        <ContextContainer title="Development">
          <HtmlText>{development}</HtmlText>
        </ContextContainer>
      )}
    </ContextContainer>
  );
}

StatementAndDevelopmentStep.propTypes = {
  id: PropTypes.string.isRequired,
  student: PropTypes.string.isRequired,
  instance: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};
