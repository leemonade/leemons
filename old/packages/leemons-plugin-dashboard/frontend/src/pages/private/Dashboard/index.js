/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { isBoolean } from 'lodash';
import { COLORS, createStyles } from '@bubbles-ui/components';
import { useIsAcademicProfile } from '@academic-portfolio/hooks';
import AcademicDashboard from './components/AcademicDashboard';
import AdminDashboard from './components/AdminDashboard';

const rightZoneWidth = '320px';
const Styles = createStyles((theme) => ({
  header: {
    position: 'relative',
    height: 80 + 48,
  },
  programSelectorContainer: {
    display: 'flex',
    height: '80px',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: '50%',
    zIndex: 5,
    backgroundColor: COLORS.mainWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: '24px 24px 24px 26px',
    alignItems: 'center',
  },
}));

export default function Dashboard({ session }) {
  let loading = true;

  const isAcademicProfile = useIsAcademicProfile();

  if (isBoolean(isAcademicProfile)) {
    loading = false;
  }

  if (loading) return null;

  if (isAcademicProfile) {
    return <AcademicDashboard session={session} />;
  }

  return <AdminDashboard session={session} />;
}

Dashboard.propTypes = {
  session: PropTypes.object,
};
