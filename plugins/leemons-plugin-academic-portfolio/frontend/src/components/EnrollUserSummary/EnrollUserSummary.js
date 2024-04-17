import React from 'react';
import PropTypes from 'prop-types';
import { useCenterPrograms } from '@academic-portfolio/hooks';

function EnrollUserSummary({ userId, center, withContactId, sysProfileFilter, viewMode }) {
  const { data: programs } = useCenterPrograms(center?.id, { enabled: !!center?.id });

  return null;
}

EnrollUserSummary.propTypes = {
  userId: PropTypes.string,
  center: PropTypes.string,
  sysProfileFilter: PropTypes.string,
  viewMode: PropTypes.string,
  withContactId: PropTypes.string,
};

export { EnrollUserSummary };
