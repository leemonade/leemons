import React from 'react';
import {
  Box,
  Button,
  Col,
  Grid,
  LoadingOverlay,
  PageContainer,
  Stack,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@fundae/helpers/prefixPN';
import { useStore } from '@common';
import { SelectCourse, SelectProgram } from '@academic-portfolio/components/Selectors';
import { addErrorAlert } from '@layout/alert';
import { getCentersWithToken } from '@users/session';
import { getProfilesRequest, listCoursesRequest } from '@academic-portfolio/request';
import SelectUserAgent from '@users/components/SelectUserAgent';

export default function Index() {
  const [t] = useTranslateLoader(prefixPN('reports'));
  const [store, render] = useStore({
    loading: true,
  });

  async function init() {
    try {
      store.loading = true;
      render();

      const { profiles } = await getProfilesRequest();
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

  async function generate() {}

  React.useEffect(() => {
    init();
  }, []);

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
                    >
                      {t('generateReport')}
                    </Button>
                  </Box>
                </Stack>
              </Col>
            </Grid>
          </Box>
        </PageContainer>
      </Stack>
    </Box>
  );
}
