import React from 'react';

import { Stack, createStyles, Text, Box, ImageLoader } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

const useAnswerFeedStyles = createStyles((theme, { isCorrect }) => {
  return {
    container: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      backgroundColor: isCorrect
        ? theme.other.core.color.success['100']
        : theme.other.core.color.danger['100'],
      gap: 8,
      padding: 8,
    },
  };
});

function Icon({ src }) {
  return (
    <Box sx={() => ({ position: 'relative', display: 'inline-block', verticalAlign: '' })}>
      <Box sx={() => ({ position: 'relative', width: '24px', height: '24px' })}>
        <ImageLoader height="24px" src={src} />
      </Box>
    </Box>
  );
}

Icon.propTypes = {
  src: PropTypes.string,
};

function AnswerFeed({ isCorrect, t }) {
  const { classes } = useAnswerFeedStyles({ isCorrect });

  const label = isCorrect ? 'correct' : 'incorrect';
  const src = isCorrect
    ? '/public/responseDetail/correct.svg'
    : '/public/responseDetail/incorrect.svg';

  return (
    <Stack className={classes.container}>
      <Icon src={src} />
      <Text>{t(label)}</Text>
    </Stack>
  );
}

AnswerFeed.propTypes = {
  t: PropTypes.func,
  isCorrect: PropTypes.bool,
};

export default AnswerFeed;
