import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, ContextContainer, PageContainer, Grid, Col } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useStore } from '@common';
import { SelectProfile } from '@users/components/SelectProfile';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { getProfilesRequest, setProfilesRequest } from '../../request';
import { activeMenuItemPrograms } from '../../helpers/activeMenuItemPrograms';

export default function ProfilesPage() {
  const [t] = useTranslateLoader(prefixPN('profiles_page'));

  // ----------------------------------------------------------------------
  // SETTINGS

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [store, render] = useStore();

  // ·····················································································
  // INIT DATA LOAD

  const messages = useMemo(
    () => ({
      header: {
        title: t('page_title'),
        description: t('page_description'),
      },
    }),
    [t]
  );

  async function init() {
    const { profiles } = await getProfilesRequest();
    store.profiles = profiles;
    reset(profiles);
    render();
  }

  useEffect(() => {
    init();
  }, []);

  async function onSubmit(data) {
    store.loading = true;
    render();
    try {
      await setProfilesRequest(data);
      await activeMenuItemPrograms();
      addSuccessAlert(t('profileSaved'));
    } catch (err) {
      addErrorAlert(err.message);
    }
    store.loading = false;
    render();
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={messages.header} />
      <PageContainer>
        <Grid>
          <Col span={5}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <ContextContainer>
                <Controller
                  name="teacher"
                  control={control}
                  rules={{ required: t('teacherRequired') }}
                  render={({ field }) => (
                    <SelectProfile
                      {...field}
                      required
                      error={errors.teacher}
                      label={t('teacher')}
                      description={t('teacherDescription')}
                    />
                  )}
                />

                <Controller
                  name="student"
                  control={control}
                  rules={{ required: t('studentRequired') }}
                  render={({ field }) => (
                    <SelectProfile
                      {...field}
                      required
                      error={errors.student}
                      label={t('student')}
                      description={t('studentDescription')}
                    />
                  )}
                />

                <Box>
                  <Button type="submit" loading={store.loading}>
                    {t('save')}
                  </Button>
                </Box>
              </ContextContainer>
            </form>
          </Col>
        </Grid>
      </PageContainer>
    </ContextContainer>
  );
}
