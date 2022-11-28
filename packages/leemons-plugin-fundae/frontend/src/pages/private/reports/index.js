import React from 'react';
import _ from 'lodash';
import {
  Box,
  Button,
  Col,
  ContextContainer,
  Grid,
  LoadingOverlay,
  PageContainer,
  Pager,
  Progress,
  Stack,
  Table,
  Title,
} from '@bubbles-ui/components';
import { SocketIoService } from '@socket-io/service';
import { LocaleDate, useStore } from '@common';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@fundae/helpers/prefixPN';
import { SelectCourse, SelectProgram } from '@academic-portfolio/components/Selectors';
import { addErrorAlert } from '@layout/alert';
import { getCentersWithToken } from '@users/session';
import { getProfilesRequest, listCoursesRequest } from '@academic-portfolio/request';
import SelectUserAgent from '@users/components/SelectUserAgent';
import { generateReportRequest, listReportsRequest } from '@fundae/request';

export default function Index() {
  const [t] = useTranslateLoader(prefixPN('reports'));
  const [store, render] = useStore({
    loading: true,
    page: 0,
    perPage: 10,
    totalPages: 0,
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
      return {
        ...item,
        created: <LocaleDate date={item.created_at} />,
        addons,
      };
    });
  }

  async function list() {
    try {
      const result = await listReportsRequest(store.page, store.perPage);
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
      store.centerId = getCentersWithToken()[0].id;

      store.loading = false;
      render();
    } catch (error) {
      addErrorAlert(error);
    }
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

  async function onSelectCourse(courseId) {
    store.selectedUserAgents = [];
    store.courseId = courseId;
    render();
  }

  async function onChangeUserAgent(e) {
    store.selectedUserAgents = e;
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
      store.page = 0;
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
    </Box>
  );
}
