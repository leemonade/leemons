/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { isBoolean } from 'lodash';
import { COLORS, createStyles } from '@bubbles-ui/components';
import useIsTeacher from '@assignables/components/Ongoing/AssignmentList/hooks/useIsTeacher';
import useIsStudent from '@assignables/components/Ongoing/AssignmentList/hooks/useIsStudent';
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
  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();
  const isOther = !isStudent && !isTeacher;

  if (isBoolean(isStudent) && isBoolean(isTeacher)) {
    loading = false;
  }

  /*
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

   */

  if (loading) return null;

  if (!isOther) {
    return <AcademicDashboard session={session} />;
  }

  return <AdminDashboard session={session} />;
}

Dashboard.propTypes = {
  session: PropTypes.object,
};
