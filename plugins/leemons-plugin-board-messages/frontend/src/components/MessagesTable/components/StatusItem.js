import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@bubbles-ui/components';

const StatusItem = ({ status, labels }) => {
  const getSeverity = () => {
    if (status === 'published') return 'success';
    if (status === 'completed') return 'error';
    return null;
  };

  const severity = getSeverity();
  return (
    <Badge closable={false} severity={severity} size="xs">
      {labels[status]}
    </Badge>
  );
};

StatusItem.propTypes = {
  status: PropTypes.string,
  labels: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { StatusItem };
