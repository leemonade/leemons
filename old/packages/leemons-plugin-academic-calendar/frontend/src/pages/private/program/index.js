import React, { useContext } from 'react';
import { Box, createStyles, DrawerPush, Paragraph, Text } from '@bubbles-ui/components';
import { FolderIcon, PluginCalendarIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { LayoutContext } from '@layout/context/layout';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@academic-calendar/helpers/prefixPN';
import { useStore } from '@common';
import { SelectCenter } from '@users/components/SelectCenter';
import { listProgramsRequest } from '@academic-portfolio/request';
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
  const { classes, cx } = useStyle();

  const { setLoading, scrollTo } = useContext(LayoutContext);
  const [store, render] = useStore({
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

  return (
    <Box className={classes.container}>
      <DrawerPush opened={true} size={320} fixed={true}>
        <Box className={classes.drawer}>
          <Box className={classes.drawerTitle}>
            <Box className={classes.titleTop}>
              <PluginCalendarIcon width={18} height={18} />
              <Text size="lg">{t('title')}</Text>
            </Box>
          </Box>
          <Paragraph
            className={classes.drawerText}
            dangerouslySetInnerHTML={{ __html: t('description') }}
          />
          <Box className={classes.form}>
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
                            program.id === store.selectedProgram?.id && classes.configItemActive
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
          </Box>
        </Box>
      </DrawerPush>
      <Box className={classes.content}>
        {store.selectedProgram ? (
          <AcademicCalendarDetail
            t={t}
            onSave={() => {
              store.selectedProgram = null;
              render();
            }}
            program={store.selectedProgram}
          />
        ) : null}
      </Box>
    </Box>
  );
}
