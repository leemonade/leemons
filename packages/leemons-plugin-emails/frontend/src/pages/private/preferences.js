import React from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  ContextContainer,
  createStyles,
  PageContainer,
  Select,
  Stack,
  Switch,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@emails/helpers/prefixPN';
import { useStore } from '@common';
import { Controller, useForm } from 'react-hook-form';

const ListPageStyles = createStyles((theme) => ({
  tabPane: {
    display: 'flex',
    flex: 1,
    height: '100%',
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
  },
}));

export default function Preferences() {
  const [t] = useTranslateLoader(prefixPN('preferences'));

  // ----------------------------------------------------------------------
  // SETTINGS
  const [store, render] = useStore({
    loading: true,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function load() {}

  React.useEffect(() => {
    load();
  }, []);

  const { classes } = ListPageStyles({});

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        variant={'teacher'}
        values={{
          title: t('pageTitle'),
        }}
        fullWidth
      />
      <PageContainer noFlex>
        <ContextContainer divided>
          <Box>
            <ContextContainer title={t('basicConfig')}>
              <Controller
                control={control}
                name="disable-all-activity-emails"
                render={({ field }) => <Switch label={t('disableAllActivityEmails')} {...field} />}
              />
              <Controller
                control={control}
                name="new-assignation-email"
                render={({ field }) => (
                  <Checkbox
                    label={t('newAssignationEmail')}
                    help={t('newAssignationEmailDescription')}
                    helpPosition="bottom"
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="week-resume-email"
                render={({ field }) => (
                  <>
                    <Checkbox
                      label={t('weekResumeEmail')}
                      help={t('weekResumeEmailDescription')}
                      helpPosition="bottom"
                      {...field}
                    />
                    <Box
                      sx={(theme) => ({
                        marginLeft: theme.spacing[8],
                        marginTop: -theme.spacing[4],
                        marginBottom: theme.spacing[6],
                        width: 125,
                      })}
                    >
                      <Select
                        data={[
                          { label: t('sunday'), value: 0 },
                          { label: t('monday'), value: 1 },
                          { label: t('tuesday'), value: 2 },
                          { label: t('wednesday'), value: 3 },
                          { label: t('thursday'), value: 4 },
                          { label: t('friday'), value: 5 },
                          { label: t('saturday'), value: 6 },
                        ]}
                      />
                    </Box>
                  </>
                )}
              />
            </ContextContainer>
            <ContextContainer title={t('advancedConfig')}>
              <Alert closeable={false} severity="warning" title={t('alertTitle')}>
                {t('alertDescription')}
              </Alert>
              <Controller
                control={control}
                name="new-assignation-per-day-email"
                render={({ field }) => (
                  <>
                    <Checkbox
                      label={t('newAssignationDaysEmail')}
                      help={t('newAssignationDaysEmailDescription')}
                      helpPosition="bottom"
                      {...field}
                    />
                    <Box
                      sx={(theme) => ({
                        marginLeft: theme.spacing[8],
                        marginTop: -theme.spacing[4],
                        width: 125,
                      })}
                    >
                      <Select
                        data={[
                          { label: t('ndays', { n: 10 }), value: 10 },
                          { label: t('ndays', { n: 7 }), value: 7 },
                          { label: t('ndays', { n: 5 }), value: 5 },
                          { label: t('ndays', { n: 2 }), value: 2 },
                        ]}
                      />
                    </Box>
                  </>
                )}
              />
              <Controller
                control={control}
                name="new-assignation-timeout-email"
                render={({ field }) => (
                  <>
                    <Checkbox
                      label={t('emailLastHour')}
                      help={t('emailLastHourDescription')}
                      helpPosition="bottom"
                      {...field}
                    />
                    <Box
                      sx={(theme) => ({
                        marginLeft: theme.spacing[8],
                        marginTop: -theme.spacing[4],
                        marginBottom: theme.spacing[6],
                        width: 125,
                      })}
                    >
                      <Select
                        data={[
                          { label: t('nhours', { n: 72 }), value: 72 },
                          { label: t('nhours', { n: 48 }), value: 48 },
                          { label: t('nhours', { n: 24 }), value: 24 },
                        ]}
                      />
                    </Box>
                  </>
                )}
              />
            </ContextContainer>
          </Box>
          <Stack justifyContent="end">
            <Button>{t('savePreferences')}</Button>
          </Stack>
        </ContextContainer>
      </PageContainer>
    </ContextContainer>
  );
}
