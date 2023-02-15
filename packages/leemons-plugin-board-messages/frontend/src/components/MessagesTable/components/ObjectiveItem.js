import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextClamp, Text } from '@bubbles-ui/components';

const ObjectiveItem = ({ objective }) => (
  <Box>
    <TextClamp lines={1}>
      <Text color="primary" role="productive">
        {objective}
      </Text>
    </TextClamp>
  </Box>
);

ObjectiveItem.propTypes = {
  objective: PropTypes.string,
};

// eslint-disable-next-line import/prefer-default-export
export { ObjectiveItem };
