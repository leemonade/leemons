/* eslint-disable no-nested-ternary */
import { Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import React from 'react';
import { ZoneWidgets } from '@widgets/ZoneWidgets';

function ClassHeaderBar(props) {
  return (
    <ZoneWidgets zone="attendance-control.class">
      {({ Component, key, properties }) => (
        <Box
          key={key}
          sx={(theme) => ({
            padding: theme.spacing[6],
          })}
        >
          <Component {...properties} {...props} inTab={true} />
        </Box>
      )}
    </ZoneWidgets>
  );
}

ClassHeaderBar.propTypes = {
  classe: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
};

export default ClassHeaderBar;
