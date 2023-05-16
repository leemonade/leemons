import React from 'react';
import { isUndefined } from 'lodash';
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
import { getConfigRequest, saveConfigRequest } from '@emails/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';

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
  const [, , , getErrorMessage] = useRequestErrorMessage();

  // ----------------------------------------------------------------------
  // SETTINGS
  const [store, render] = useStore({
    loading: true,
  });

  const { watch, reset, control, getValues, setValue } = useForm();

  const disableEmail = watch('disable-all-activity-emails');
  const newAssignations = watch('new-assignation-email');

  async function load() {
    try {
      const { configs } = await getConfigRequest();
      reset(configs);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  async function save() {
    try {
      store.saving = true;
      render();
      await saveConfigRequest(getValues());
      addSuccessAlert(t('settingsSaved'));
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    store.saving = false;
    render();
  }

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
                render={({ field }) => (
                  <Switch
                    {...field}
                    label={t('disableAllActivityEmails')}
                    onChange={(e) => {
                      reset({
                        'disable-all-activity-emails': e,
                        'week-resume-email': false,
                        'new-assignation-email': false,
                        'new-assignation-timeout-email': false,
                        'new-assignation-per-day-email': false,
                      });
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="new-assignation-email"
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    disabled={disableEmail}
                    label={t('newAssignationEmail')}
                    help={t('newAssignationEmailDescription')}
                    helpPosition="bottom"
                    checked={field.value}
                    onChange={(e) => {
                      if (!e) {
                        setValue('new-assignation-per-day-email', false);
                      }
                      field.onChange(e);
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="week-resume-email"
                render={({ field }) => (
                  <>
                    <Checkbox
                      {...field}
                      disabled={disableEmail}
                      label={t('weekResumeEmail')}
                      help={t('weekResumeEmailDescription')}
                      helpPosition="bottom"
                      checked={!isUndefined(field.value) && field.value !== false}
                      onChange={(e) => {
                        field.onChange(e ? 1 : false);
                      }}
                    />
                    {field.value ? (
                      <Box
                        sx={(theme) => ({
                          marginLeft: theme.spacing[8],
                          marginTop: -theme.spacing[4],
                          marginBottom: theme.spacing[6],
                          width: 125,
                        })}
                      >
                        <Select
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          value={field.value}
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
                    ) : null}
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
                      {...field}
                      disabled={disableEmail || !newAssignations}
                      label={t('newAssignationDaysEmail')}
                      help={t('newAssignationDaysEmailDescription')}
                      helpPosition="bottom"
                      checked={!isUndefined(field.value) && field.value !== false}
                      onChange={(e) => {
                        field.onChange(e ? 10 : false);
                      }}
                    />
                    {field.value ? (
                      <Box
                        sx={(theme) => ({
                          marginLeft: theme.spacing[8],
                          marginTop: -theme.spacing[4],
                          width: 125,
                        })}
                      >
                        <Select
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          value={field.value}
                          data={[
                            { label: t('ndays', { n: 10 }), value: 10 },
                            { label: t('ndays', { n: 7 }), value: 7 },
                            { label: t('ndays', { n: 5 }), value: 5 },
                            { label: t('ndays', { n: 2 }), value: 2 },
                          ]}
                        />
                      </Box>
                    ) : null}
                  </>
                )}
              />
              <Controller
                control={control}
                name="new-assignation-timeout-email"
                render={({ field }) => (
                  <>
                    <Checkbox
                      {...field}
                      disabled={disableEmail}
                      label={t('emailLastHour')}
                      help={t('emailLastHourDescription')}
                      helpPosition="bottom"
                      checked={!isUndefined(field.value) && field.value !== false}
                      onChange={(e) => {
                        field.onChange(e ? 72 : false);
                      }}
                    />
                    {field.value ? (
                      <Box
                        sx={(theme) => ({
                          marginLeft: theme.spacing[8],
                          marginTop: -theme.spacing[4],
                          marginBottom: theme.spacing[6],
                          width: 125,
                        })}
                      >
                        <Select
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          value={field.value}
                          data={[
                            { label: t('nhours', { n: 72 }), value: 72 },
                            { label: t('nhours', { n: 48 }), value: 48 },
                            { label: t('nhours', { n: 24 }), value: 24 },
                          ]}
                        />
                      </Box>
                    ) : null}
                  </>
                )}
              />
            </ContextContainer>
          </Box>
          <Box sx={(theme) => ({ marginBottom: theme.spacing[6] })}>
            <Stack fullWidth justifyContent="end">
              <Button onClick={save} loading={store.saving}>
                {t('savePreferences')}
              </Button>
            </Stack>
          </Box>
        </ContextContainer>
      </PageContainer>
    </ContextContainer>
  );
}
