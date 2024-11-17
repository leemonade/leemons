import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { ZoneWidgets } from '@widgets';
import prefixPN from '../../../helpers/prefixPN';

function TabProgress(props) {
  const widgets = useCallback(
    ({ Component, key, properties }) => (
      <Box
        key={key}
        sx={(theme) => ({
          padding: properties.noPadding ? 0 : theme.spacing[6],
        })}
      >
        <Component {...properties} {...props} />
      </Box>
    ),
    [props]
  );

  return <ZoneWidgets zone={prefixPN('class.progress')}>{widgets}</ZoneWidgets>;
}

TabProgress.propTypes = {
  classe: PropTypes.object.isRequired,
  // key: PropTypes.string.isRequired,
};

export default TabProgress;
