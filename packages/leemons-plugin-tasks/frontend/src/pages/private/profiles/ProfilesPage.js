import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { forIn } from 'lodash';
import {
  ContextContainer,
  PageContainer,
  Button,
  Box,
  Stack,
  Grid,
  Col,
} from '@bubbles-ui/components';
import { useForm, Controller } from 'react-hook-form';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { SelectProfile } from '@users/components/SelectProfile';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getProfilesRequest } from '@academic-portfolio/request';
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

  useEffect(() => {
    (async () => {
      const profiles = await getProfiles(['teacher', 'student']);

      profiles
        .filter(({ profile }) => profile)
        .forEach(({ key, profile }) => {
          const state = getFieldState(key);

          if (!state.isTouched) {
            setValue(key, profile);
          }
        });
    })();
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

  const loadProfilesFromAP = async () => {
    try {
      const { profiles } = await getProfilesRequest();
      forIn(profiles, (profile, key) => {
        setValue(key, profile);
      });
    } catch (e) {
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
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid>
            <Col span={5}>
              <ContextContainer divided>
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
                </ContextContainer>
                <Box>
                  <Stack fullWidth justifyContent="space-between" spacing={5}>
                    <Button variant="outline" onClick={loadProfilesFromAP}>
                      {t('loadFromAP')}
                    </Button>
                    <Button type="submit" loading={loading}>
                      {t('save')}
                    </Button>
                  </Stack>
                </Box>
              </ContextContainer>
            </Col>
          </Grid>
        </form>
      </PageContainer>
    </ContextContainer>
  );
}
