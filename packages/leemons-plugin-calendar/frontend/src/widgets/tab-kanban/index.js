/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { ZoneWidgets } from '@widgets';

function TabKanbanWidget(props) {
  return (
    <ZoneWidgets zone="plugins.calendar.class.kanban">
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

TabKanbanWidget.propTypes = {
  classe: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
};

export default TabKanbanWidget;
