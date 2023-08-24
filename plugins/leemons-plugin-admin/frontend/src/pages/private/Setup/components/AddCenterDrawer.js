import prefixPN from '@admin/helpers/prefixPN';
import { getLanguagesRequest } from '@admin/request/settings';
import {
  Box,
  Button,
  ContextContainer,
  Drawer,
  InputWrapper,
  NumberInput,
  Select,
  Stack,
  Switch,
  TextInput,
  createStyles,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addCenterRequest, listProfilesRequest, listRolesRequest } from '@users/request';
import countryList from 'country-region-data';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

const Styles = createStyles((theme) => ({
  inputContent: {
    '>div': {
      '&:first-child': {
        width: '35%',
      },
      '&:last-child': {
        width: '65%',
      },
    },
  },
}));

const AddCenterDrawer = ({ opened, onClose, onSave, center = {} }) => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('addCenterDrawer'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const { classes: styles } = Styles();
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [store, render] = useStore({
    locales: [],
    timeZones: [],
    dayWeeks: [],
    countries: [],
  });

  const formValues = watch();

  async function load() {
    const [
      {
        langs: { locales },
      },
      {
        data: { items: profiles },
      },
      {
        data: { items: roles },
      },
    ] = await Promise.all([
      getLanguagesRequest(),
      listProfilesRequest({
        page: 0,
        size: 99999,
      }),
      listRolesRequest({
        page: 0,
        size: 99999,
      }),
    ]);
    store.roles = roles;
    store.profiles = profiles;
    store.locales = map(locales, ({ code, name }) => ({ label: name, value: code }));
    store.timeZones = map(Intl.supportedValuesOf('timeZone'), (item) => ({
      label: item,
      value: item,
    }));
    store.dayWeeks = [
      { label: t('monday'), value: 1 },
      { label: t('tuesday'), value: 2 },
      { label: t('wednesday'), value: 3 },
      { label: t('thursday'), value: 4 },
      { label: t('friday'), value: 5 },
      { label: t('saturday'), value: 6 },
      { label: t('sunday'), value: 0 },
    ];
    store.countries = map(countryList, (item) => ({
      value: item.countryShortCode,
      label: item.countryName,
    }));
    render();
  }

  async function onSubmit({ created_at, deleted_at, updated_at, deleted, limits, ...data }) {
    try {
      store.saving = true;
      render();
      const finalLimits = [];
      if (limits.profiles && Object.keys(limits.profiles).length) {
        finalLimits.push(...Object.values(limits.profiles));
      }
      if (limits.roles && Object.keys(limits.roles).length) {
        finalLimits.push(...Object.values(limits.roles));
      }
      const { center: c } = await addCenterRequest({ ...data, limits: finalLimits });
      onSave({ ...c, limits });
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  function r(n) {
    return { required: t(n) };
  }

  React.useEffect(() => {
    if (!tLoading) load();
  }, [tLoading]);

  React.useEffect(() => {
    reset(center);
  }, [center]);

  return (
    <Drawer size={715} opened={opened} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <ContextContainer>
          <ContextContainer divided>
            <ContextContainer title={t(center?.id ? 'editCenter' : 'newCenter')}>
              {/* -- Name -- */}
              <Stack fullWidth className={styles.inputContent} alignItems="center">
                <InputWrapper label={`${t('name')}*`} />
                <Controller
                  name="name"
                  control={control}
                  rules={r('nameRequired')}
                  render={({ field }) => <TextInput error={errors.name} {...field} />}
                />
              </Stack>
              {/* -- Locale -- */}
              <Stack fullWidth className={styles.inputContent} alignItems="center">
                <InputWrapper label={`${t('preferredLanguage')}*`} />
                <Controller
                  name="locale"
                  control={control}
                  rules={r('preferredLanguageRequired')}
                  render={({ field }) => (
                    <Select data={store.locales} error={errors.locale} {...field} />
                  )}
                />
              </Stack>
              {/* -- Time zone -- */}
              <Stack fullWidth className={styles.inputContent} alignItems="center">
                <InputWrapper label={t('timeZone')} />
                <Controller
                  name="timezone"
                  control={control}
                  render={({ field }) => (
                    <Select data={store.timeZones} error={errors.timeZone} {...field} />
                  )}
                />
              </Stack>
              {/* -- First day of week -- */}
              <Stack fullWidth className={styles.inputContent} alignItems="center">
                <InputWrapper label={`${t('firstDayOfWeek')}*`} />
                <Controller
                  name="firstDayOfWeek"
                  rules={r('firstDayOfWeekRequired')}
                  control={control}
                  render={({ field }) => (
                    <Select data={store.dayWeeks} error={errors.firstDayOfWeek} {...field} />
                  )}
                />
              </Stack>
            </ContextContainer>
            <ContextContainer
              subtitle={t('emailForNotifications')}
              description={t('emailForNotificationsDescription')}
            >
              {/* -- Email -- */}
              <Stack fullWidth className={styles.inputContent} alignItems="center">
                <InputWrapper label={`${t('email')}*`} />
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    ...r('emailForNotificationsRequired'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: t('emailForNotificationsInvalid'),
                    },
                  }}
                  render={({ field }) => <TextInput error={errors.email} {...field} />}
                />
              </Stack>
            </ContextContainer>
            <ContextContainer subtitle={t('extraData')} divided>
              {/* -- Country -- */}
              <Stack fullWidth className={styles.inputContent} alignItems="center">
                <InputWrapper label={`${t('country')}`} />
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select data={store.countries} error={errors.country} {...field} />
                  )}
                />
              </Stack>
              <ContextContainer subtitle={t('address')}>
                {/* -- City -- */}
                <Stack fullWidth className={styles.inputContent} alignItems="center">
                  <InputWrapper label={`${t('city')}`} />
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => <TextInput error={errors.city} {...field} />}
                  />
                </Stack>
                {/* -- Postal code -- */}
                <Stack fullWidth className={styles.inputContent} alignItems="center">
                  <InputWrapper label={`${t('postalCode')}`} />
                  <Controller
                    name="postalCode"
                    control={control}
                    render={({ field }) => <TextInput error={errors.postalCode} {...field} />}
                  />
                </Stack>
                {/* -- Postal code -- */}
                <Stack fullWidth className={styles.inputContent} alignItems="center">
                  <InputWrapper label={`${t('street')}`} />
                  <Controller
                    name="street"
                    control={control}
                    render={({ field }) => <TextInput error={errors.street} {...field} />}
                  />
                </Stack>
              </ContextContainer>
              <ContextContainer subtitle={t('contactInfo')}>
                {/* -- Phone -- */}
                <Stack fullWidth className={styles.inputContent} alignItems="center">
                  <InputWrapper label={`${t('phone')}`} />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => <TextInput error={errors.phone} {...field} />}
                  />
                </Stack>
                {/* -- Email -- */}
                <Stack fullWidth className={styles.inputContent} alignItems="center">
                  <InputWrapper label={`${t('email')}`} />
                  <Controller
                    name="contactEmail"
                    control={control}
                    render={({ field }) => <TextInput error={errors.contactEmail} {...field} />}
                  />
                </Stack>
              </ContextContainer>
              <ContextContainer subtitle={t('userLimits')}>
                {/* -- Profiles -- */}
                <InputWrapper label={`${t('profiles')}`} />

                {store.profiles?.map((item, index) => (
                  <Stack
                    key={item.id}
                    fullWidth
                    className={styles.inputContent}
                    alignItems="center"
                  >
                    <Box sx={(theme) => ({ paddingRight: theme.spacing[2] })}>
                      <InputWrapper label={item.name} description={item.description} />
                    </Box>
                    <Box>
                      <Box sx={() => ({ display: 'flex', width: '100%' })}>
                        <Box sx={(theme) => ({ paddingRight: theme.spacing[4] })}>
                          <Controller
                            name={`limits.profiles[${item.id}].item`}
                            defaultValue={item.id}
                            control={control}
                            render={() => null}
                          />
                          <Controller
                            name={`limits.profiles[${item.id}].type`}
                            defaultValue={'profile'}
                            control={control}
                            render={() => null}
                          />
                          <Controller
                            name={`limits.profiles[${item.id}].unlimited`}
                            control={control}
                            render={({ field }) => (
                              <Switch
                                label={t('unlimited')}
                                onChange={(e) => {
                                  if (!formValues?.limits?.profiles?.[item.id]?.limit) {
                                    setValue(`limits.profiles[${item.id}].limit`, 1);
                                  }
                                  field.onChange(e);
                                }}
                                checked={field.value !== false}
                              />
                            )}
                          />
                        </Box>
                        <Box sx={() => ({ width: '100%' })}>
                          <Controller
                            name={`limits.profiles[${item.id}].limit`}
                            control={control}
                            render={({ field }) => (
                              <NumberInput
                                min={1}
                                {...field}
                                disabled={
                                  formValues?.limits?.profiles?.[item.id]?.unlimited !== false
                                }
                              />
                            )}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                ))}

                {/* -- Roles -- */}
                <InputWrapper label={`${t('roles')}`} />

                {store.roles?.map((item, index) => (
                  <Stack
                    key={item.id}
                    fullWidth
                    className={styles.inputContent}
                    alignItems="center"
                  >
                    <Box sx={(theme) => ({ paddingRight: theme.spacing[2] })}>
                      <InputWrapper label={item.name} description={item.description} />
                    </Box>
                    <Box>
                      <Box sx={() => ({ display: 'flex', width: '100%' })}>
                        <Box sx={(theme) => ({ paddingRight: theme.spacing[4] })}>
                          <Controller
                            name={`limits.roles[${item.id}].item`}
                            defaultValue={item.id}
                            control={control}
                            render={() => null}
                          />
                          <Controller
                            name={`limits.roles[${item.id}].type`}
                            defaultValue={'role'}
                            control={control}
                            render={() => null}
                          />
                          <Controller
                            name={`limits.roles[${item.id}].unlimited`}
                            control={control}
                            render={({ field }) => (
                              <Switch
                                label={t('unlimited')}
                                onChange={(e) => {
                                  if (!formValues?.limits?.roles?.[item.id]?.limit) {
                                    setValue(`limits.roles[${item.id}].limit`, 1);
                                  }
                                  field.onChange(e);
                                }}
                                checked={field.value !== false}
                              />
                            )}
                          />
                        </Box>
                        <Box sx={() => ({ width: '100%' })}>
                          <Controller
                            name={`limits.roles[${item.id}].limit`}
                            control={control}
                            render={({ field }) => (
                              <NumberInput
                                min={1}
                                {...field}
                                disabled={formValues?.limits?.roles?.[item.id]?.unlimited !== false}
                              />
                            )}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                ))}
              </ContextContainer>
            </ContextContainer>
          </ContextContainer>
          <Stack fullWidth justifyContent="end">
            <Box>
              <Button loading={store.saving} type="submit">
                {t('save')}
              </Button>
            </Box>
          </Stack>
        </ContextContainer>
      </form>
    </Drawer>
  );
};

AddCenterDrawer.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  center: PropTypes.any,
  onSave: PropTypes.func,
};

export { AddCenterDrawer };
export default AddCenterDrawer;
