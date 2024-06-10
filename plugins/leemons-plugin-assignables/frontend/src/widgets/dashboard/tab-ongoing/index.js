import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { ZoneWidgets } from '@widgets';
import ZoneWidgetsBoundary from '@widgets/ZoneWidgetsBoundary';
import prefixPN from '../../../helpers/prefixPN';

const useStyles = createStyles((theme) => ({
  errorClassName: {
    padding: theme.spacing[6],
  },
}));

function TabOngoing(props) {
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

  const { classes } = useStyles();

  return (
    <ZoneWidgets
      zone={prefixPN('class.ongoing')}
      ErrorBoundary={<ZoneWidgetsBoundary errorClassName={classes.errorClassName} />}
    >
      {widgets}
    </ZoneWidgets>
  );
}

TabOngoing.propTypes = {
  classe: PropTypes.object.isRequired,
  // key: PropTypes.string.isRequired,
};

export default TabOngoing;
