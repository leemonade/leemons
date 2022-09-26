import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Stack } from '@bubbles-ui/components';
import { ChevronLeftIcon, ChevronRightIcon } from '@bubbles-ui/icons/outline';

function QuestionButtons({ t, question, value, currentIndex, onNext, onPrev }) {
  const nextText = React.useMemo(() => {
    if (question.required) return t('next');
    if (value) return t('next');
    return t('skip');
  }, [question, value]);

  return (
    <Stack
      sx={(theme) => ({ marginTop: theme.spacing[6] })}
      fullWidth
      justifyContent="space-between"
    >
      {currentIndex !== 0 ? (
        <Button
          position="right"
          variant="light"
          leftIcon={<ChevronLeftIcon />}
          rounded
          compact
          onClick={onPrev}
        >
          {t('back')}
        </Button>
      ) : (
        <Box />
      )}

      <Button
        position="left"
        rightIcon={<ChevronRightIcon />}
        rounded
        compact
        onClick={onNext}
        disabled={question.required && !value}
      >
        {nextText}
      </Button>
    </Stack>
  );
}

QuestionButtons.propTypes = {
  t: PropTypes.func,
  question: PropTypes.any,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  value: PropTypes.any,
  currentIndex: PropTypes.number,
};

QuestionButtons.defaultProps = {
  onNext: () => {},
  onPrev: () => {},
};

export default QuestionButtons;
