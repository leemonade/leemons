import { SelectCourse, SelectProgram } from '@academic-portfolio/components/Selectors';
import { getProfilesRequest, listCoursesRequest } from '@academic-portfolio/request';
import {
  Box,
  Button,
  COLORS,
  Col,
  ContextContainer,
  Grid,
  IconButton,
  LoadingOverlay,
  PageContainer,
  Pager,
  Progress,
  Stack,
  Table,
  Title,
} from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import { AlertWarningTriangleIcon } from '@bubbles-ui/icons/solid';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { LocaleDate, useStore } from '@common';
import prefixPN from '@fundae/helpers/prefixPN';
import { Pdf } from '@fundae/pages/private/reports/pdf';
import { generateReportRequest, listReportsRequest, retryReportRequest } from '@fundae/request';
import { addErrorAlert } from '@layout/alert';
import { SocketIoService } from '@mqtt-socket-io/service';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components';
import SelectUserAgent from '@users/components/SelectUserAgent';
import _ from 'lodash';
import React from 'react';
import { useReactToPrint } from 'react-to-print';

function toDate(a) {
  if (a) {
    const dateObj = new Date(a);
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return `${year}-${month}-${day}`;
  }
  return null;
}

export default function Index() {
  const printRef = React.useRef();
  const [t] = useTranslateLoader(prefixPN('reports'));
  const [store, render] = useStore({
    loading: true,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });

  store.handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${t('report')} - ${store.downloadReport?.userAgentName} - ${toDate(
      store.downloadReport?.created_at
    )}`,
  });

  const tableHeaders = [
    {
      Header: t('student'),
      accessor: 'studentName',
      className: 'text-left',
    },
    {
      Header: t('program'),
      accessor: 'programName',
      className: 'text-left',
    },
    {
      Header: t('startDate'),
      accessor: 'created',
      className: 'text-left',
    },
    {
      Header: ' ',
      accessor: 'addons',
      className: 'text-left',
    },
  ];

  function downloadPDF(item) {
    store.downloadReport = { ...item.report, created_at: item.created_at, item };
    render();
    setTimeout(() => {
      store.handlePrint();
    }, 100);
  }

  function retry(item) {
    retryReportRequest(item.id);
  }

  function updateStoreData() {
    store.data = _.map(store.data, (item) => {
      let addons = null;
      if (item.percentageCompleted < 100) {
        addons = (
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Box style={{ width: 100 }}>
              <Progress value={item.percentageCompleted} />
            </Box>
            <Box sx={(theme) => ({ fontSize: 12, fontWeight: 500, marginLeft: theme.spacing[1] })}>
              {item.percentageCompleted}%
            </Box>
          </Box>
        );
      }
      if (item.percentageCompleted === 100) {
        addons = (
          <Box>
            <IconButton
              onClick={() => downloadPDF(item)}
              icon={<DownloadIcon height={16} width={16} />}
              color="primary"
              rounded
              label={t('downloadPDF')}
            />
          </Box>
        );
      }
      if (item.percentageCompleted === 0) {
        addons = (
          <Box>
            <Button
              size="xs"
              color="fatic"
              variant="outline"
              onClick={() => retry(item)}
              leftIcon={<AlertWarningTriangleIcon style={{ color: COLORS.fatic01 }} />}
            >
              {t('retry')}
            </Button>
          </Box>
        );
      }
      return {
        ...item,
        created: (
          <LocaleDate
            date={item.created_at}
            options={{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            }}
          />
        ),
        programName: item.program?.name || item.report?.programName,
        studentName: [
          item.userAgent.user.name,
          item.userAgent.user.surnames,
          item.userAgent.user.secondSurname,
        ]
          .filter((item) => !_.isEmpty(item))
          .join(' '),
        addons,
      };
    });
  }

  async function list() {
    try {
      const filters = {};
      if (store.filterProgramId) {
        filters.program = store.filterProgramId;
      }
      if (store.filterCourseId) {
        filters.course = store.filterCourseId;
      }
      if (store.filterSelectedUserAgents?.length) {
        filters.userAgent_$in = store.filterSelectedUserAgents;
      }
      const result = await listReportsRequest(store.page - 1, store.perPage, filters);

      store.totalPages = result.data.totalPages;
      store.data = result.data.items;
      updateStoreData();
      render();
    } catch (e) {}
  }

  async function init() {
    try {
      store.loading = true;
      render();

      const [{ profiles }] = await Promise.all([getProfilesRequest(), list()]);
      store.profiles = profiles;

      store.loading = false;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
  }

  async function onSelectCenter(centerId) {
    store.courseId = null;
    store.selectedUserAgents = [];
    store.programId = null;
    store.filterProgramId = null;
    store.centerId = centerId;
    store.filterSelectedUserAgents = [];
    store.filterCourseId = null;
    render();
  }

  async function onSelectProgram(programId) {
    store.courseId = null;
    store.selectedUserAgents = [];
    store.programId = programId;
    render();
    const {
      data: { items },
    } = await listCoursesRequest({ page: 0, size: 9999, program: programId });
    store.hasCourses = items.length;
    // ES: Si isAlone es true significa que el programa no tiene cursos y es el grupo creado por defecto
    if (items[0].isAlone) {
      store.hasCourses = false;
    }
    render();
  }

  async function onFilterSelectProgram(programId) {
    store.filterCourseId = null;
    store.filterSelectedUserAgents = [];
    store.filterProgramId = programId;
    render();
    const {
      data: { items },
    } = await listCoursesRequest({ page: 0, size: 9999, program: programId });
    store.filterHasCourses = items.length;
    // ES: Si isAlone es true significa que el programa no tiene cursos y es el grupo creado por defecto
    if (items[0].isAlone) {
      store.filterHasCourses = false;
    }
    store.page = 1;
    list();
    render();
  }

  async function onSelectCourse(courseId) {
    store.selectedUserAgents = [];
    store.courseId = courseId;
    render();
  }

  async function onFilterSelectCourse(courseId) {
    store.filterSelectedUserAgents = [];
    store.filterCourseId = courseId;
    store.page = 1;
    list();
    render();
  }

  async function onChangeUserAgent(e) {
    store.selectedUserAgents = e;
    render();
  }

  async function onFilterChangeUserAgent(e) {
    store.filterSelectedUserAgents = e;
    store.page = 1;
    list();
    render();
  }

  async function generate() {
    try {
      store.generating = true;
      render();
      await generateReportRequest({
        userAgents: store.selectedUserAgents,
        course: store.courseId,
        program: store.programId,
      });
      store.selectedUserAgents = [];
      store.courseId = null;
      store.filterProgramId = null;
      store.filterCourseId = null;
      store.filterSelectedUserAgents = [];
      store.page = 1;
      list();
    } catch (e) {
      addErrorAlert(e);
    }
    store.generating = false;
    render();
  }

  React.useEffect(() => {
    init();
  }, []);

  SocketIoService.useOn('FUNDAE_REPORT_CHANGE', (event, data) => {
    const index = _.findIndex(store.data, { id: data.id });
    if (index >= 0) {
      store.data[index].percentageCompleted = data.percentageCompleted;
      if (data.report) store.data[index].report = data.report;
      updateStoreData();
      render();
    }
  });

  if (store.loading) return <LoadingOverlay visible />;

  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
      <Stack direction="column" fullHeight>
        <AdminPageHeader
          values={{
            title: t('title'),
          }}
        />
        <PageContainer>
          <ContextContainer>
            <Box sx={(theme) => ({ marginTop: theme.spacing[6] })}>
              <Grid>
                <Col span={3}>
                  <SelectCenter
                    clearable={true}
                    label={t('centerLabel')}
                    onChange={onSelectCenter}
                    value={store.centerId}
                  />
                </Col>
              </Grid>
              <Grid grow>
                <Col span={3}>
                  <SelectProgram
                    firstSelected
                    label={t('programLabel')}
                    onChange={onSelectProgram}
                    center={store.centerId}
                    value={store.programId}
                  />
                </Col>
                {store.hasCourses ? (
                  <Col span={3}>
                    <SelectCourse
                      firstSelected
                      label={t('courseLabel')}
                      onChange={onSelectCourse}
                      program={store.programId}
                      value={store.courseId}
                    />
                  </Col>
                ) : null}
                <Col span={6}>
                  <Stack fullWidth spacing={1}>
                    <Box>
                      <SelectUserAgent
                        disabled={
                          !(
                            store.programId &&
                            ((store.hasCourses && store.courseId) || !store.hasCourses)
                          )
                        }
                        value={store.selectedUserAgents}
                        centers={[store.centerId]}
                        profiles={[store.profiles?.student]}
                        programs={store.programId}
                        courses={store.courseId}
                        onChange={onChangeUserAgent}
                        maxSelectedValues={9999}
                        label={t('studentsLabel')}
                        itemRenderProps={{}}
                        valueRenderProps={{}}
                      />
                    </Box>
                    <Box sx={(theme) => ({ marginTop: theme.spacing[5] })} skipFlex>
                      <Button
                        size="sm"
                        disabled={!store.selectedUserAgents || !store.selectedUserAgents.length}
                        onClick={generate}
                        loading={store.generating}
                      >
                        {t('generateReport')}
                      </Button>
                    </Box>
                  </Stack>
                </Col>
              </Grid>
            </Box>

            <Box>
              <Title order={4}>{t('reportsGenerated')}</Title>

              <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                <Grid grow>
                  <Col span={3}>
                    <SelectProgram
                      clearable
                      firstSelected
                      label={t('programLabel')}
                      onChange={onFilterSelectProgram}
                      center={store.centerId}
                      value={store.filterProgramId}
                    />
                  </Col>

                  <Col span={3}>
                    {store.filterHasCourses ? (
                      <SelectCourse
                        clearable
                        label={t('courseLabel')}
                        onChange={onFilterSelectCourse}
                        program={store.filterProgramId}
                        value={store.filterCourseId}
                      />
                    ) : null}
                  </Col>

                  <Col span={6}>
                    {store.filterProgramId &&
                    ((store.filterHasCourses && store.filterCourseId) ||
                      !store.filterHasCourses) ? (
                      <SelectUserAgent
                        value={store.filterSelectedUserAgents}
                        centers={[store.centerId]}
                        profiles={[store.profiles?.student]}
                        programs={store.filterProgramId}
                        courses={store.filterCourseId}
                        onChange={onFilterChangeUserAgent}
                        maxSelectedValues={9999}
                        label={t('studentsLabel')}
                        itemRenderProps={{}}
                        valueRenderProps={{}}
                      />
                    ) : null}
                  </Col>
                </Grid>
              </Box>

              <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                <Table columns={tableHeaders} data={store.data} />
              </Box>

              {store.totalPages > 1 && (
                <Stack fullWidth justifyContent={'center'}>
                  <Pager
                    labels={{
                      goTo: t('goTo'),
                      show: t('show'),
                    }}
                    page={store.page}
                    totalPages={Math.ceil(store.totalPages)}
                    withSize={true}
                    size={store.perPage}
                    onSizeChange={(e) => {
                      store.perPage = e;
                      list();
                    }}
                    onChange={(e) => {
                      store.page = e;
                      list();
                    }}
                  />
                </Stack>
              )}
            </Box>
          </ContextContainer>
        </PageContainer>
      </Stack>
      {store.downloadReport ? (
        <Pdf ref={printRef} show={false} t={t} report={store.downloadReport} />
      ) : null}
    </Box>
  );
}
