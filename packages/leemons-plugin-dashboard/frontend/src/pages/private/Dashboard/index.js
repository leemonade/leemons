/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import {
  Box,
  COLORS,
  ContextContainer,
  createStyles,
  PageContainer,
  Title,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@dashboard/helpers/prefixPN';
import { getProfilesRequest, getUserProgramsRequest } from '@academic-portfolio/request';
import { getUserProfilesRequest } from '@users/request';
import { forEach } from 'lodash';
import { ZoneWidgets } from '@widgets';
import { HeaderBackground } from '@bubbles-ui/leemons';

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
  const { classes: styles } = Styles();
  const [t] = useTranslateLoader(prefixPN('dashboard'));

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

    if (store.isAcademicMode) {
      const { programs } = await getUserProgramsRequest();
      store.programs = programs;
      if (store.programs.length >= 1) {
        [store.selectedProgram] = store.programs;
      }
    }

    store.loading = false;
    render();
  }

  function selectProgram(program) {
    store.selectedProgram = program;
    render();
  }

  React.useEffect(() => {
    init();
  }, []);

  const widgets = React.useCallback(
    ({ Component, key }) => (
      <Box
        key={key}
        sx={(theme) => ({
          paddingTop: theme.spacing[6],
          paddingBottom: theme.spacing[6],
        })}
      >
        <Component program={store.selectedProgram} session={session} />
      </Box>
    ),
    [store.selectedProgram, session]
  );

  if (store.loading) return null;

  const programImage = null;
  const headerProps = {};
  if (programImage) {
    headerProps.blur = 10;
    headerProps.withBlur = true;
    headerProps.image = programImage;
    headerProps.backgroundPosition = 'center';
  } else {
    headerProps.withBlur = false;
    headerProps.withGradient = false;
    headerProps.color = store.selectedProgram?.color || 'rgb(255, 204, 153)';
  }

  // TODO: Añadir en el header que se puedan seleccionar los programas

  return (
    <>
      <Box
        sx={() => ({
          // paddingRight: store.selectedProgram ? rightZoneWidth : 0,
        })}
      >
        <Box className={styles.header}>
          <HeaderBackground {...headerProps} styles={{ position: 'absolute' }} />
          <Box className={styles.programSelectorContainer}>
            <Title order={3}>
              {store.isAcademicMode && store.programs.length
                ? store.selectedProgram
                  ? store.selectedProgram.name
                  : t('selectYourProgram')
                : t('dashboard')}
            </Title>
          </Box>
        </Box>

        <ContextContainer fullHeight>
          <PageContainer
            sx={(theme) => ({
              paddingTop: theme.spacing[8],
              maxWidth: '100%',
            })}
          >
            <Box>
              {store.selectedProgram ? (
                <>
                  {/* -- LEFT ZONE -- */}
                  <ZoneWidgets zone="plugins.dashboard.program.left">{widgets}</ZoneWidgets>
                </>
              ) : null}
            </Box>
          </PageContainer>
        </ContextContainer>

        {/* -- RIGHT ZONE -- */}
        {/* store.selectedProgram ? (
          <Paper
            sx={(theme) => ({
              position: 'fixed',
              right: 0,
              top: 0,
              bottom: 0,
              background: theme.colors.uiBackground02,
              width: rightZoneWidth,
            })}
          >
            <ZoneWidgets zone="plugins.dashboard.program.right">
              {({ Component, key }) => (
                <Box key={key}>
                  <Component program={store.selectedProgram} session={session} />
                </Box>
              )}
            </ZoneWidgets>
          </Paper>
        ) : null */}
      </Box>
    </>
  );
}

Dashboard.propTypes = {
  session: PropTypes.object,
};
