import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { TagsAutocomplete, useStore } from '@common';

const ByTag = ({ tree, messages }) => {
  const [store, render] = useStore({});

  return (
    <Box>
      <TagsAutocomplete pluginName="users" />
    </Box>
  );
};

ByTag.propTypes = {
  messages: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { ByTag };
