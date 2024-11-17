import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { Box, Button, Stack } from '@bubbles-ui/components';
import { ChevronLeftIcon, ChevronRightIcon } from '@bubbles-ui/icons/outline';

function QuestionButtons({ t, viewMode, feedback, question, value, currentIndex, onNext, onPrev }) {
  const hasValue = React.useMemo(() => {
    if (question.type === 'multiResponse') {
      return value.length >= question.properties.minResponses;
    }
    return !isNil(value);
  }, [question, JSON.stringify(value)]);

  const isLast = React.useMemo(
    () => feedback.questions.length - 1 === currentIndex,
    [feedback, currentIndex]
  );

  const nextText = React.useMemo(() => {
    if (isLast) return t('sendFeedback');
    if (question.required) return t('next');
    if (hasValue) return t('next');
    return t('skip');
  }, [question, hasValue, isLast]);

  const disabled = question.required && !hasValue;

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

      {!viewMode || (viewMode && !isLast) ? (
        <Button
          position="left"
          rightIcon={<ChevronRightIcon />}
          rounded
          compact
          variant={!isLast ? 'outline' : null}
          onClick={() => {
            if (!disabled) onNext(hasValue ? value : undefined);
          }}
          disabled={disabled}
        >
          {nextText}
        </Button>
      ) : null}
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
  feedback: PropTypes.any,
  viewMode: PropTypes.bool,
};

QuestionButtons.defaultProps = {
  onNext: () => {},
  onPrev: () => {},
};

export default QuestionButtons;
