import React from 'react';
import PropTypes from 'prop-types';

import { ContextContainer, HtmlText, Title } from '@bubbles-ui/components';

export default function DevelopmentStep({ assignation, labels: _labels }) {
  const labels = _labels?.development_step;
  const { development } = assignation?.instance?.assignable;

  return (
    <ContextContainer>
      <ContextContainer>
        <Title color="primary" order={2}>
          {labels?.development}
        </Title>
        <HtmlText>{development}</HtmlText>
      </ContextContainer>
    </ContextContainer>
  );
}

DevelopmentStep.propTypes = {
  assignation: PropTypes.shape({
    instance: PropTypes.shape({
      assignable: PropTypes.shape({
        development: PropTypes.string,
      }),
    }),
  }),
  labels: PropTypes.shape({
    development_step: PropTypes.shape({
      development: PropTypes.string,
    }),
  }),
};
