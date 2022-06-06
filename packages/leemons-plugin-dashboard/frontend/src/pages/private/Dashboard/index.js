/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import { COLORS, createStyles } from '@bubbles-ui/components';
import { getProfilesRequest } from '@academic-portfolio/request';
import { getUserProfilesRequest } from '@users/request';
import { forEach } from 'lodash';
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
  const [store, render] = useStore({
    loading: true,
    isAcademicMode: false,
  });

  async function init() {
    const [{ profiles: academicProfiles }, { profiles: userProfiles }] = await Promise.all([
      getProfilesRequest(),
      getUserProfilesRequest(),
    ]);
    // eslint-disable-next-line consistent-return
    forEach(userProfiles, (userProfile) => {
      if (
        userProfile.id === academicProfiles.teacher ||
        userProfile.id === academicProfiles.student
      ) {
        store.isAcademicMode = true;
        return false;
      }
    });

    store.loading = false;
    render();
  }

  React.useEffect(() => {
    init();
  }, []);

  if (store.loading) return null;

  if (store.isAcademicMode) {
    return <AcademicDashboard session={session} />;
  }

  return <AdminDashboard session={session} />;
}

Dashboard.propTypes = {
  session: PropTypes.object,
};
