/* eslint-disable import/prefer-default-export */
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@bubbles-ui/icons/outline';
import PropTypes from 'prop-types';
import { Box, Button } from '@bubbles-ui/components';

export function ButtonNavigation({
  index,
  store,
  classes,
  t,
  isFirstStep,
  prevStep,
  nextStep,
  disableNext = false,
  nextLabel,
}) {
  const showFirstButton = !isFirstStep && (!store.embedded || (store.embedded && index > 0));

  const isLastButton = index === store.questions.length - 1;
  const showLastButton = !store.embedded || (store.embedded && !isLastButton);
  return (
    <>
      <Box className={!showFirstButton ? classes.continueButtonFirst : classes.continueButton}>
        {showFirstButton ? (
          <Button
            position="right"
            variant="light"
            leftIcon={<ChevronLeftIcon />}
            rounded
            compact
            onClick={prevStep}
          >
            {t('prev')}
          </Button>
        ) : null}

        {showLastButton ? (
          <Button
            position="left"
            variant={isLastButton ? null : 'outline'}
            rightIcon={<ChevronRightIcon />}
            rounded
            compact
            onClick={nextStep}
            disabled={disableNext}
          >
            {store.embedded ? t('nextButton') : nextLabel || t('next')}
          </Button>
        ) : null}
      </Box>
    </>
  );
}

ButtonNavigation.propTypes = {
  classes: PropTypes.any,
  t: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  store: PropTypes.any,
  index: PropTypes.number,
  nextLabel: PropTypes.string,
};
