import React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@bubbles-ui/components';

import useCoverCopyright from './CoverCopyright.styles';
import CopyrightText from '../Copyright/CopyrightText';

export default function CoverCopyright({
  author,
  authorUrl,
  source,
  sourceUrl,
  bottomOffset,
  align,
}) {
  const { classes } = useCoverCopyright({ bottomOffset, align });

  return (
    <Box className={classes.root}>
      <CopyrightText
        author={author}
        authorUrl={authorUrl}
        source={source}
        sourceUrl={sourceUrl}
        reverseColors
        resourceType={source?.toLowerCase() === 'unsplash' ? 'photo' : 'image'}
      />
    </Box>
  );
}

CoverCopyright.propTypes = {
  author: PropTypes.string.isRequired,
  authorUrl: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  sourceUrl: PropTypes.string.isRequired,
  bottomOffset: PropTypes.number,
  align: PropTypes.oneOf(['left', 'right', 'center']),
};

CoverCopyright.defaultProps = {
  bottomOffset: 0,
};
