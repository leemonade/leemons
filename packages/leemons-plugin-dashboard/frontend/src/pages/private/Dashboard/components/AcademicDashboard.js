/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import { Box, ContextContainer, createStyles, PageContainer } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@dashboard/helpers/prefixPN';
import { getUserProgramsRequest } from '@academic-portfolio/request';
import { ZoneWidgets } from '@widgets';
import { HeaderBackground, HeaderDropdown } from '@bubbles-ui/leemons';
import { find, isNil, map } from 'lodash';
import { getSessionConfig, updateSessionConfig } from '@users/session';

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
    alignItems: 'center',
  },
}));

export default function AcademicDashboard({ session }) {
  const [store, render] = useStore({
    loading: true,
  });
  const { classes: styles } = Styles();
  const [t] = useTranslateLoader(prefixPN('dashboard'));

  function selectProgram(program) {
    store.selectedProgram = find(store.programs, { id: program.id });
    if (isNil(store.selectedProgram)) {
      [store.selectedProgram] = store.programs;
    }
    updateSessionConfig({ program: store.selectedProgram.id });
    render();
  }

  // ·································································
  // FIRST LOAD

  async function init() {
    const { programs } = await getUserProgramsRequest();
    store.programs = programs;

    try {
      if (store.programs.length > 0) {
        const sessionConfig = getSessionConfig();
        if (sessionConfig.program) {
          selectProgram({ id: sessionConfig.program });
        } else {
          selectProgram(store.programs[0]);
        }
      }
    } catch (e) {
      //
    }

    store.loading = false;
    render();
  }

  React.useEffect(() => {
    init();
  }, []);

  // ·································································
  // RENDER

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
    [JSON.stringify(store.selectedProgram), session]
  );

  if (store.loading) return null;

  const programImage = !isNil(store.selectedProgram?.image.cover)
    ? store.selectedProgram?.imageUrl
    : undefined;
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

  store.programsSelect = map(store.programs, (program) => ({
    id: program.id,
    color: program.color,
    image: !isNil(program.image?.cover) ? program.imageUrl : undefined,
    label: program.name,
    description: program.description || '',
    icon: program.icon,
  }));

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
            <HeaderDropdown
              value={store.selectedProgram}
              data={store.programsSelect}
              readOnly={store.programsSelect?.length <= 1}
              onChange={selectProgram}
            />
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

AcademicDashboard.propTypes = {
  session: PropTypes.object,
};
