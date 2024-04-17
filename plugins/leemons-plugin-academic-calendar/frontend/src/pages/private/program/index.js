import prefixPN from '@academic-calendar/helpers/prefixPN';
import { listProgramsRequest } from '@academic-portfolio/request';
import {
  Box,
  Col,
  ContextContainer,
  createStyles,
  Grid,
  PageContainer,
  Paper,
  TotalLayoutContainer,
  TotalLayoutHeader,
  TotalLayoutStepContainer,
  VerticalStepper,
  Select,
  Stack,
} from '@bubbles-ui/components';
import { FolderIcon, PluginCalendarIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components/SelectCenter';
import React, { useEffect, useState } from 'react';
import { getCentersWithToken } from '@users/session';
import AcademicCalendarDetail from './components/AcademicCalendarDetail';

const useStyle = createStyles((theme) => ({
  container: {
    display: 'flex',
  },
  content: {
    width: 'calc(100% - 320px)',
    boxSizing: 'border-box',
  },
  pageContainer: {
    paddingLeft: 0,
    paddingRight: 0,
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
  const [t] = useTranslateLoader(prefixPN('programList'));
  const scrollRef = React.useRef(null);
  const [userCenters, setUserCenters] = useState();
  const [selectedCenter, setSelectedCenter] = useState();
  const [selectedProgram, setSelectedProgram] = useState();
  const [step, setStep] = useState(0);
  const { classes, cx } = useStyle();

  const [store, render] = useStore({
    scroll: 0,
    showDetail: false,
    center: null,
    mounted: true,
    programs: [],
    currentProgram: null,
  });

  async function loadProgramConfigs() {
    const response = await listProgramsRequest({ page: 0, size: 9999, center: store.center?.id });
    store.programs = response.data?.items || [];
    store.selectedProgram = store.programs[0];
    setSelectedProgram(store.programs[0]);
    render();
  }

  function handleOnSelectCenter(center) {
    setSelectedCenter(center);
    store.center = center;
    loadProgramConfigs();
  }

  function handleOnSelectProgram(program) {
    store.selectedProgram = program;
    setSelectedProgram(program);
    render();
  }

  useEffect(() => {
    const centers = getCentersWithToken();
    setUserCenters(centers);
    handleOnSelectCenter(centers[0]);
  }, []);

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          title={t('title')}
          icon={<PluginCalendarIcon width={24} height={24} />}
          scrollRef={scrollRef}
          cancelable={false}
        >
          <ContextContainer direction="row" alignItems="flex-start">
            <SelectCenter
              firstSelected
              onChange={(v) => handleOnSelectCenter(userCenters?.find((c) => c.id === v))}
              value={selectedCenter?.id}
            />
            <Select
              firstSelected
              onChange={(v) => handleOnSelectProgram(store.programs.find((p) => p.id === v))}
              value={selectedProgram?.id}
              data={store.programs.map((program) => ({ value: program.id, label: program.name }))}
            />
          </ContextContainer>
        </TotalLayoutHeader>
      }
    >
      <ContextContainer
        sx={(theme) => ({
          paddingInline: theme.spacing[12],
          overflow: 'auto',
        })}
      >
        <Grid>
          <Col span={2} sx={(theme) => ({ paddingTop: theme.spacing[8] })}>
            <VerticalStepper
              data={[{ label: t('basic') }, { label: t('periods') }, { label: t('preview') }]}
              currentStep={step}
            />
          </Col>
          <Col span={10}>
            <Stack
              justifyContent="center"
              ref={scrollRef}
              style={{ overflow: 'auto' }}
              fullWidth
              fullHeight
            >
              <TotalLayoutStepContainer
                stepName={`${selectedCenter?.name} - ${selectedProgram?.name}`}
              >
                <ContextContainer
                  sx={(theme) => ({
                    paddingBottom: theme.spacing[12],
                    overflow: 'auto',
                  })}
                  fullHeight
                  fullWidth
                >
                  <PageContainer noFlex fullWidth className={classes.pageContainer}>
                    {store.selectedProgram ? (
                      <AcademicCalendarDetail
                        t={t}
                        onSave={() => {
                          store.selectedProgram = null;
                          render();
                        }}
                        program={store.selectedProgram}
                        onChangeStep={setStep}
                      />
                    ) : null}
                  </PageContainer>
                </ContextContainer>
              </TotalLayoutStepContainer>
            </Stack>
          </Col>
        </Grid>
      </ContextContainer>
    </TotalLayoutContainer>
  );
}
