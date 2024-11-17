import React from 'react';
import PropTypes from 'prop-types';
import { currentProfileIsAdmin } from '@users/session';
import { AcademicDashboard } from '@dashboard/components/AcademicDashboard';
import { AdminDashboard } from '@dashboard/components/AdminDashboard';

export default function Dashboard({ session }) {
  const isAdmin = currentProfileIsAdmin();

  if (isAdmin) {
    return <AdminDashboard session={session} />;
  }

  return <AcademicDashboard session={session} />;
}

Dashboard.propTypes = {
  session: PropTypes.object,
};
