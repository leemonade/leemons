import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { ZoneWidgets } from '@widgets';
import prefixPN from '../../../helpers/prefixPN';

function TabOngoing(props) {
  const widgets = useCallback(
    ({ Component, key, properties }) => (
      <Box
        key={key}
        sx={(theme) => ({
          padding: theme.spacing[6],
        })}
      >
        <Component {...properties} {...props} />
      </Box>
    ),
    [props]
  );

  return <ZoneWidgets zone={prefixPN('class.ongoing')}>{widgets}</ZoneWidgets>;
}

TabOngoing.propTypes = {
  classe: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
};

export default TabOngoing;
