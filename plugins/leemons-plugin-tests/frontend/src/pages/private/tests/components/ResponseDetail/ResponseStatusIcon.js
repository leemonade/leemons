import React from 'react';

import { Box, ImageLoader } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

function ResponseStatusIcon({ isCorrect }) {
  const src = isCorrect
    ? '/public/tests/responseDetail/correct.svg'
    : '/public/tests/responseDetail/incorrect.svg';

  return (
    <Box sx={() => ({ position: 'relative', display: 'inline-block', verticalAlign: '' })}>
      <Box sx={() => ({ position: 'relative', width: '24px', height: '24px' })}>
        <ImageLoader height="24px" src={src} />
      </Box>
    </Box>
  );
}

ResponseStatusIcon.propTypes = {
  isCorrect: PropTypes.bool,
};

export default ResponseStatusIcon;
export { ResponseStatusIcon };
