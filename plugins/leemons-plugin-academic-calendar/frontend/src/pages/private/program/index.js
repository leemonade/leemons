import prefixPN from '@academic-calendar/helpers/prefixPN';
import { getConfigRequest } from '@academic-calendar/request';
import { useProgramsList } from '@academic-portfolio/hooks';
import {
  Box,
  ContextContainer,
  createStyles,
  PageContainer,
  TotalLayoutContainer,
  TotalLayoutHeader,
  TotalLayoutStepContainer,
  VerticalStepperContainer,
  ImageLoader,
  Stack,
  Table,
  ActionButton,
  Title,
  Loader,
} from '@bubbles-ui/components';
import { EditIcon, PluginCalendarIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components/SelectCenter';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { getCentersWithToken } from '@users/session';
import AcademicCalendarDetail from './components/AcademicCalendarDetail';
import { EmptyState } from './components/EmptyState';

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
  const [programs, setPrograms] = useState();
  const [step, setStep] = useState(0);
  const { classes, cx } = useStyle();
  const calendarRef = useRef();

  const [store, render] = useStore({
    scroll: 0,
    showDetail: false,
    center: null,
    mounted: true,
    programs: [],
    currentProgram: null,
  });

  const { data: programsList, isLoading: programsIsLoading } = useProgramsList(
    { page: 0, size: 9999, center: store.center?.id },
    { enabled: !!store.center?.id }
  );

  function formatDate(date) {
    if (!date) return null;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async function loadProgramConfigs() {
    if (programsList?.data.items) {
      const programsWithConfig = await Promise.all(
        programsList.data.items.map(async (program) => {
          try {
            const configResponse = await getConfigRequest(program.id);
            const courseDates = Object.values(configResponse.config.courseDates || {});
            const startDates = courseDates.map((date) => new Date(date.startDate));
            const endDates = courseDates.map((date) => new Date(date.endDate));
            const startCourse = startDates.length > 0 ? new Date(Math.min(...startDates)) : null;
            const endCourse = endDates.length > 0 ? new Date(Math.max(...endDates)) : null;
            const startCourseStr = formatDate(startCourse);
            const endCourseStr = formatDate(endCourse);
            return {
              ...program,
              config: {
                ...configResponse.config,
                startCourse: startCourseStr,
                endCourse: endCourseStr,
              },
            };
          } catch (error) {
            console.error('Error loading config for program', program.id, error);
            return program;
          }
        })
      );

      store.programs = programsWithConfig;
      setPrograms(programsWithConfig);
      render();
    }
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

  useEffect(() => {
    if (programsList) {
      loadProgramConfigs();
    }
  }, [programsList]);

  const columns = useMemo(
    () => [
      {
        Header: t('tableHeaderCover'),
        accessor: 'imageUrl',
        Cell: ({ value }) => (
          <Box>
            <ImageLoader height="42px" width="72px" radius={4} src={value} />
          </Box>
        ),
      },
      {
        Header: t('tableHeaderProgram'),
        accessor: 'name',
      },
      {
        Header: t('tableHeaderCourseInit'),
        accessor: 'config.startCourse',
        Cell: ({ value }) => {
          if (value) {
            return <>{value}</>;
          }
          return '-';
        },
      },
      {
        Header: t('tableHeaderCourseEnd'),
        accessor: 'config.endCourse',
        Cell: ({ value }) => {
          if (value) {
            return <>{value}</>;
          }
          return '-';
        },
      },
      {
        Header: '',
        accessor: 'actions',
        cellStyle: { justifyContent: 'end' },
      },
    ],
    [programs, programs?.config]
  );

  const programsData = useMemo(
    () =>
      store?.programs?.map((program) => ({
        ...program,
        actions: (
          <Stack>
            <Box>
              <ActionButton
                icon={<EditIcon width={20} height={20} />}
                onClick={() => {
                  store.currentProgram = program;
                  handleOnSelectProgram(program);
                  setSelectedProgram(program);
                  setStep(1);
                  render();
                }}
              />
            </Box>
          </Stack>
        ),
      })),
    [programs, programsIsLoading, programsList]
  );

  const stepNames = [
    { label: t('basic'), status: 'OK' },
    { label: t('periods'), status: 'OK' },
    { label: t('preview'), status: 'OK' },
  ];
  if (programsIsLoading) {
    return (
      <TotalLayoutContainer>
        <Loader />
      </TotalLayoutContainer>
    );
  }

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          title={t('title')}
          icon={<PluginCalendarIcon width={24} height={24} />}
          scrollRef={scrollRef}
          cancelable={store.currentProgram}
          onCancel={() => {
            store.currentProgram = null;
            setSelectedProgram(null);
            setStep(0);
          }}
        >
          <ContextContainer direction="row" alignItems="flex-start">
            {selectedCenter?.name && selectedProgram?.name ? (
              <Title order={3}>{`${selectedCenter?.name} - ${selectedProgram?.name}`}</Title>
            ) : (
              <SelectCenter
                firstSelected
                onChange={(v) => handleOnSelectCenter(userCenters?.find((c) => c.id === v))}
                value={selectedCenter?.id}
              />
            )}
          </ContextContainer>
        </TotalLayoutHeader>
      }
    >
      <Stack
        justifyContent="center"
        ref={scrollRef}
        style={{ overflow: 'auto' }}
        fullWidth
        fullHeight
      >
        {store.currentProgram ? (
          <VerticalStepperContainer
            scrollRef={scrollRef}
            currentStep={step}
            data={[
              { label: t('basic'), status: 'OK' },
              { label: t('periods'), status: 'OK' },
              { label: t('preview'), status: 'OK' },
            ]}
            onChangeActiveIndex={setStep}
          >
            <TotalLayoutStepContainer stepName={`${stepNames[step]?.label}`}>
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
                        store.currentProgram = null;
                        setSelectedProgram(null);
                        setStep(0);
                        render();
                      }}
                      program={store.selectedProgram}
                      onChangeStep={setStep}
                      scrollRef={scrollRef}
                      calendarRef={calendarRef}
                    />
                  ) : null}
                </PageContainer>
              </ContextContainer>
            </TotalLayoutStepContainer>
          </VerticalStepperContainer>
        ) : (
          <TotalLayoutStepContainer stepName={`${selectedCenter?.name}`}>
            {programsList?.data?.items?.length > 0 && !programsIsLoading ? (
              <Table columns={columns} data={programsData || []} />
            ) : (
              <EmptyState t={t} />
            )}
          </TotalLayoutStepContainer>
        )}
      </Stack>
    </TotalLayoutContainer>
  );
}
