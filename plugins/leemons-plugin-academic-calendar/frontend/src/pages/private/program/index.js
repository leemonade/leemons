import prefixPN from '@academic-calendar/helpers/prefixPN';
import { listProgramsRequest } from '@academic-portfolio/request';
import {
  Box,
  Col,
  ContextContainer,
  Grid,
  PageContainer,
  Paper,
  createStyles,
  useResizeObserver,
} from '@bubbles-ui/components';
import { FolderIcon } from '@bubbles-ui/icons/outline';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useLayout } from '@layout/context';
import { LayoutContext } from '@layout/context/layout';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components/SelectCenter';
import React, { useContext } from 'react';
import AcademicCalendarDetail from './components/AcademicCalendarDetail';

const useStyle = createStyles((theme) => ({
  container: {
    display: 'flex',
  },
  content: {
    width: 'calc(100% - 320px)',
    boxSizing: 'border-box',
  },
  drawer: {
    height: '100vh',
    padding: theme.spacing[7],
    paddingLeft: theme.spacing[10],
    borderRight: `1px solid ${theme.colors.ui01}`,
    marginBottom: theme.spacing[7],
  },
  drawerTitle: {
    marginBottom: theme.spacing[7],
    '*': {
      color: theme.colors.text04,
      fontSize: `${theme.fontSizes[3]}px!important`,
    },
  },
  titleTop: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  drawerText: {
    marginBottom: theme.spacing[10],
  },

  formTitle: {
    display: 'block',
    marginBottom: theme.spacing[5],
  },
  form: {
    paddingBottom: theme.spacing[7] * 2,
  },
  configItem: {
    padding: `${theme.spacing[3]}px ${theme.spacing[4]}px`,
    fontWeight: 500,
    verticalAlign: 'middle',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.interactive01v1,
      color: theme.colors.interactive01,
    },
  },
  configItemActive: {
    backgroundColor: theme.colors.interactive01v1,
    color: theme.colors.interactive01,
  },
  configItemName: {
    paddingLeft: theme.spacing[2],
    display: 'inline',
  },
}));

export default function ProgramCalendars() {
  const [t, , , loading] = useTranslateLoader(prefixPN('programList'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [containerRef, container] = useResizeObserver();
  const [headerBaseRef, headerBase] = useResizeObserver();
  const [headerDescriptionRef, headerDescription] = useResizeObserver();
  const { classes, cx } = useStyle();
  const { layoutState } = useLayout();

  const { setLoading, scrollTo } = useContext(LayoutContext);
  const [store, render] = useStore({
    scroll: 0,
    showDetail: false,
    center: null,
    mounted: true,
    programs: [],
    currentProgram: null,
  });

  async function loadProgramConfigs() {
    const response = await listProgramsRequest({ page: 0, size: 9999, center: store.center });
    store.programs = response.data?.items || [];
    render();
  }

  function handleOnSelectCenter(center) {
    store.center = center;
    loadProgramConfigs();
  }

  function onScroll() {
    store.scroll = layoutState.contentRef.current.scrollTop;
    render();
  }

  React.useEffect(() => {
    layoutState.contentRef.current?.addEventListener('scroll', onScroll);

    // cleanup this component
    return () => {
      layoutState.contentRef.current?.removeEventListener('scroll', onScroll);
    };
  }, [layoutState.contentRef.current]);

  let { scroll } = store;
  if (scroll > headerBase.height) scroll = headerBase.height;
  const correct = 48;
  const correctBottom = 24;

  let top = headerBase.height + correct - scroll;
  const minTop = headerBase.height - headerDescription.height + 24;
  if (top < minTop) {
    top = minTop;
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        baseRef={headerBaseRef}
        descriptionRef={headerDescriptionRef}
        values={{
          title: t('title'),
          description: t('description'),
        }}
      />

      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Grid>
              {/* TREE ----------------------------------------- */}
              <Col span={4}>
                <Box ref={containerRef}>
                  <Box
                    style={{
                      width: `${container.width}px`,
                      position: 'fixed',
                      top: `${top}px`,
                      height: `calc(100vh - ${top + correctBottom}px)`,
                    }}
                  >
                    <Paper fullWidth padding={5}>
                      <ContextContainer divided>
                        <Box>
                          <SelectCenter
                            label={t('selectCenter')}
                            onChange={handleOnSelectCenter}
                            firstSelected
                          />
                        </Box>

                        {store.center ? (
                          <Box>
                            <Box sx={(theme) => ({ marginTop: theme.spacing[3] })}>
                              {store.programs
                                ? store.programs.map((program) => (
                                    <Box
                                      key={program.id}
                                      className={cx(
                                        classes.configItem,
                                        program.id === store.selectedProgram?.id &&
                                          classes.configItemActive
                                      )}
                                      onClick={() => {
                                        store.selectedProgram = program;
                                        render();
                                      }}
                                    >
                                      <FolderIcon width={16} height={16} />
                                      <Box className={classes.configItemName}>{program.name}</Box>
                                    </Box>
                                  ))
                                : null}
                            </Box>
                          </Box>
                        ) : null}
                      </ContextContainer>
                    </Paper>
                  </Box>
                </Box>
              </Col>
              {/* CONTENT ----------------------------------------- */}
              <Col span={8}>
                {store.selectedProgram ? (
                  <Paper style={{ position: 'relative' }} fullWidth padding={5}>
                    <AcademicCalendarDetail
                      t={t}
                      onSave={() => {
                        store.selectedProgram = null;
                        render();
                      }}
                      program={store.selectedProgram}
                    />
                  </Paper>
                ) : null}
              </Col>
            </Grid>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
