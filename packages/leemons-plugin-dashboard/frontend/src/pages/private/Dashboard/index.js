/* eslint-disable no-nested-ternary */
import React from 'react';
import { useStore } from '@common';
import {
  Box,
  Col,
  ContextContainer,
  Grid,
  ImageLoader,
  PageContainer,
  Paper,
  Paragraph,
  Stack,
  Title,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@dashboard/helpers/prefixPN';
import { getProfilesRequest, getUserProgramsRequest } from '@academic-portfolio/request';
import { getUserProfilesRequest } from '@users/request';
import { forEach } from 'lodash';
import { ProgramCard } from '@academic-portfolio/components/ProgramCard';
import { ZoneWidgets } from '@widgets';

const rightZoneWidth = '320px';

export default function Dashboard() {
  const [store, render] = useStore({
    loading: true,
    isAcademicMode: false,
  });
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

  if (store.loading) return null;

  return (
    <ContextContainer fullHeight>
      <PageContainer
        sx={(theme) => ({
          paddingTop: theme.spacing[8],
          marginRight: store.selectedProgram ? rightZoneWidth : 0,
        })}
      >
        <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
          <Stack>
            <Box
              sx={(theme) => ({ marginRight: theme.spacing[2] })}
              style={{ width: '24px', height: '24px', position: 'relative' }}
            >
              <ImageLoader src="/public/assets/svgs/plugin-dashboard-black.svg" />
            </Box>
            <Stack direction="column">
              <Title order={3}>
                {store.isAcademicMode
                  ? store.selectedProgram
                    ? store.selectedProgram.name
                    : t('selectYourProgram')
                  : t('dashboard')}
              </Title>
              {store.selectedProgram ? <Paragraph>{t('controlPanel')}</Paragraph> : null}
            </Stack>
          </Stack>
        </Box>
        {!store.selectedProgram && store.programs ? (
          <Grid columns={3}>
            {store.programs.map((program) => (
              <Col span={1} key={program.id}>
                <ProgramCard program={program} onClick={selectProgram} />
              </Col>
            ))}
          </Grid>
        ) : null}
        {store.selectedProgram ? (
          <>
            {/* -- LEFT ZONE -- */}
            <ZoneWidgets zone="plugins.dashboard.program.left">
              {({ Component, key }) => {
                console.log(Component, key);
                return (
                  <Box key={key}>
                    <Component program={store.selectedProgram} />
                  </Box>
                );
              }}
            </ZoneWidgets>
            {/* -- RIGHT ZONE -- */}
            <Paper
              sx={(theme) => ({
                position: 'absolute',
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
                    <Component program={store.selectedProgram} />
                  </Box>
                )}
              </ZoneWidgets>
            </Paper>
          </>
        ) : null}
      </PageContainer>
    </ContextContainer>
  );
}
