import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@bubbles-ui/icons/outline';
import PropTypes from 'prop-types';
import { Box, Button } from '@bubbles-ui/components';

export function ButtonNavigation({ classes, t, isFirstStep, prevStep, nextStep, nextLabel }) {
  return (
    <>
      <Box className={isFirstStep ? classes.continueButtonFirst : classes.continueButton}>
        {!isFirstStep ? (
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

        <Button
          position="left"
          rightIcon={<ChevronRightIcon />}
          style={{ width: 338 }}
          rounded
          compact
          onClick={nextStep}
        >
          {nextLabel || t('next')}
        </Button>
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
};
