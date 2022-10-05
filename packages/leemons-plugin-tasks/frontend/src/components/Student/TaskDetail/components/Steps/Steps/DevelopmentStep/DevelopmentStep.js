import React from 'react';
import PropTypes from 'prop-types';

import { Box, Button, ContextContainer, HtmlText, Title } from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import LimitedTimeAlert from '../../../LimitedTimeAlert';

export default function DevelopmentStep({
  assignation,
  localizations: _labels,
  setButtons,
  onPrevStep,
  onNextStep,
  hasPrevStep,
  hasNextStep,
  hasDeliverable,
  index,
  previousIndex,
}) {
  const labels = _labels?.development_step;
  const { development: developments } = assignation.instance.assignable.metadata;
  const developmentLength = developments?.length;
  const [step, setStep] = React.useState(previousIndex < index ? 0 : developmentLength - 1);

  const development = developments?.[step]?.development;

  const hasNextDevelopment = step < developmentLength - 1;
  const hasPrevDevelopment = step > 0;

  React.useEffect(() => {
    setButtons(
      <>
        <Box>
          {hasPrevDevelopment && (
            <Button
              onClick={() => setStep((s) => s - 1)}
              variant="link"
              leftIcon={<ChevLeftIcon />}
            >
              {_labels?.buttons?.previous}
            </Button>
          )}
          {!hasPrevDevelopment && hasPrevStep && (
            <Button onClick={onPrevStep} variant="link" leftIcon={<ChevLeftIcon />}>
              {_labels?.buttons?.previous}
            </Button>
          )}
        </Box>
        {hasNextDevelopment && (
          <Button
            onClick={() => setStep((s) => s + 1)}
            variant="outline"
            rightIcon={<ChevRightIcon />}
            rounded
          >
            {_labels?.buttons?.next}
          </Button>
        )}
        {!hasNextDevelopment && hasNextStep && (
          <Button onClick={onNextStep} variant="outline" rightIcon={<ChevRightIcon />} rounded>
            {hasNextStep ? _labels?.buttons?.next : _labels?.buttons?.finish}
          </Button>
        )}
      </>
    );
  }, [
    setButtons,
    onPrevStep,
    onNextStep,
    hasPrevStep,
    hasNextStep,
    hasNextDevelopment,
    hasPrevDevelopment,
    step,
    _labels?.buttons,
  ]);

  return (
    <ContextContainer>
      <ContextContainer>
        <Title color="primary" order={2}>
          {labels?.development} {developmentLength > 1 && `(${step + 1}/${developmentLength})`}
        </Title>
        <HtmlText>{development}</HtmlText>
        <LimitedTimeAlert
          assignation={assignation}
          labels={_labels?.limitedTimeAlert}
          show={hasDeliverable && !hasNextDevelopment}
        />
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
