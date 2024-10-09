import React from 'react';

import ProgramBarSelector from '@academic-portfolio/components/ProgramBarSelector/ProgramBarSelector';
import { getUserProgramsRequest } from '@academic-portfolio/request';
import { Box, createStyles, TotalLayoutContainer } from '@bubbles-ui/components';
import { useStore } from '@common';
import { getSessionConfig, updateSessionConfig } from '@users/session';
import { ZoneWidgets } from '@widgets';
import _, { find, isNil, map } from 'lodash';
import PropTypes from 'prop-types';

import EmptyState from './EmptyState';

const Styles = createStyles(() => ({
  header: {
    position: 'relative',
    height: 80,
  },
  content: {
    backgroundColor: '#F8F9FB',
    overflow: 'auto',
  },
  programSelectorContainer: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    zIndex: 5,
    alignItems: 'center',
    width: 'fit-content',
    maxWidth: 700,
    minWidth: 250,
    marginLeft: 30,
  },
  widgets: {
    paddingBlock: 20,
    paddingInline: 24,
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      '& > div:empty': {
        display: 'none',
      },
    },
  },
}));

function AcademicDashboard({ session }) {
  const [store, render] = useStore({
    loading: true,
  });
  const { classes: styles } = Styles({}, { name: 'AcademicDashboard' });
  const scrollRef = React.useRef();

  async function selectProgram(program) {
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
    store.programs = _.map(programs, (program) => ({
      ...program,
      imageUrl: leemons.apiUrl + program.imageUrl,
    }));

    try {
      if (store.programs.length > 0) {
        const sessionConfig = getSessionConfig();
        if (sessionConfig.program) {
          await selectProgram({ id: sessionConfig.program });
        } else {
          await selectProgram(store.programs[0]);
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
    ({ Component, key, properties }) => (
      <Box key={key}>
        <Component program={store.selectedProgram} session={session} />
      </Box>
    ),
    [JSON.stringify(store.selectedProgram), session]
  );

  if (store.loading) return null;
  if (!store.programs?.length) {
    return <EmptyState />;
  }
  const programImage = !isNil(store.selectedProgram?.image?.cover)
    ? store.selectedProgram?.imageUrl
    : undefined;
  const headerProps = {};

  if (programImage) {
    headerProps.blur = 10;
    headerProps.withBlur = true;
    headerProps.image = programImage.startsWith('http')
      ? programImage
      : leemons.apiUrl + programImage;
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
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <Box className={styles.header}>
          <ProgramBarSelector onChange={selectProgram} />
        </Box>
      }
    >
      <Box ref={scrollRef} className={styles.content}>
        <Box className={styles.widgets}>
          {store.selectedProgram ? (
            <>
              {/* -- LEFT ZONE -- */}
              <ZoneWidgets zone="dashboard.program.left">{widgets}</ZoneWidgets>
            </>
          ) : null}
        </Box>
      </Box>
    </TotalLayoutContainer>
  );
}

AcademicDashboard.propTypes = {
  session: PropTypes.object,
};

export { AcademicDashboard };
