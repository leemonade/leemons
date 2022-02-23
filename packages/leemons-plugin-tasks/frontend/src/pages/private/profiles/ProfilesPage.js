import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ContextContainer, PageContainer, Button, Box, Grid, Col } from '@bubbles-ui/components';
import { useForm, Controller } from 'react-hook-form';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { SelectProfile } from '@users/components/SelectProfile';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '../../../helpers';
import { getProfiles, setProfiles } from '../../../request/profiles';

export default function ProfilesPage() {
  const [t] = useTranslateLoader(prefixPN('profiles_page'));
  const {
    control,
    handleSubmit,
    getFieldState,
    setValue,
    formState: { errors },
  } = useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------------------------
  // SETTINGS

  useEffect(async () => {
    const profiles = await getProfiles(['teacher', 'student']);

    profiles
      .filter(({ profile }) => profile)
      .forEach(({ key, profile }) => {
        const state = getFieldState(key);

        if (!state.isTouched) {
          setValue(key, profile);
        }
      });
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await setProfiles(Object.entries(data).map(([key, profile]) => ({ key, profile })));
      addSuccessAlert(t('profileSaved'));

      history.push('/private/tasks/welcome');
    } catch (e) {
      setLoading(false);
      addErrorAlert(e.message);
    }
  };

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

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={messages.header} />
      <PageContainer>
        <Grid>
          <Col span={5}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                  <Button type="submit" loading={loading}>
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
