import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Stack } from '@bubbles-ui/components';

function QuestionButtons({ question, currentIndex, onNext, onPrev }) {
  return (
    <Stack fullWidth justifyContent="space-between">
      {currentIndex !== 0 ? <Button onClick={onPrev}>Volver</Button> : <Box />}

      <Button onClick={onNext}>Siguiente</Button>
    </Stack>
  );
}

QuestionButtons.propTypes = {
  question: PropTypes.any,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  currentIndex: PropTypes.number,
};

QuestionButtons.defaultProps = {
  onNext: () => {},
  onPrev: () => {},
};

export default QuestionButtons;
