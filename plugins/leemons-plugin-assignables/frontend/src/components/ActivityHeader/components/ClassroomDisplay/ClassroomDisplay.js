import React from 'react';
import PropTypes from 'prop-types';
import { ClassroomItemDisplay } from '@academic-portfolio/components';

export default function ClassroomDisplay({ instance, hidden }) {
  if (hidden) {
    return null;
  }

  return (
    <ClassroomItemDisplay
      classroomIds={instance?.classes}
      showSubject
      isModule={!!instance?.metadata?.module}
      compact
    />
  );
}

ClassroomDisplay.propTypes = {
  instance: PropTypes.shape({
    classes: PropTypes.array,
    metadata: PropTypes.shape({
      module: PropTypes.object,
    }),
  }),
  hidden: PropTypes.bool,
};
