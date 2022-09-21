import React from 'react';
import { map } from 'lodash';
import {
  Box,
  Button,
  ContextContainer,
  createStyles,
  Drawer,
  InputWrapper,
  Select,
  Stack,
  TextInput,
} from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import { getLanguagesRequest } from '@admin/request/settings';
import { useStore } from '@common';
import { Controller, useForm } from 'react-hook-form';
import countryList from 'country-region-data';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import { addCenterRequest } from '@users/request';

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

  async function load() {
    const [
      {
        langs: { locales },
      },
    ] = await Promise.all([getLanguagesRequest()]);
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

  async function onSubmit({ created_at, deleted_at, updated_at, deleted, ...data }) {
    try {
      store.saving = true;
      render();
      const { center: c } = await addCenterRequest(data);
      onSave(c);
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
              title={t('emailForNotifications')}
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
            <ContextContainer title={t('extraData')} divided>
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
