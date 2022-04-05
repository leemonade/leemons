/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { ZoneWidgets } from '@widgets';

function TabStudentTasksWidget(props) {
  return (
    <ZoneWidgets zone="plugins.tasks.class.students.tasks">
      {({ Component, key, properties }) => (
        <Box
          key={key}
          sx={(theme) => ({
            padding: theme.spacing[6],
          })}
        >
          <Component {...properties} {...props} />
        </Box>
      )}
    </ZoneWidgets>
  );
}

TabStudentTasksWidget.propTypes = {
  classe: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
};

export default TabStudentTasksWidget;
