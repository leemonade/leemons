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
            variant="outline"
            leftIcon={<ChevronLeftIcon />}
            style={{ width: 338 }}
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
            rightIcon={<ChevronRightIcon />}
            style={{ width: 338 }}
            rounded
            compact
            onClick={nextStep}
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
