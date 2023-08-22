import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Box,
  Button,
  Col,
  ContextContainer,
  DatePicker,
  Grid,
  InputWrapper,
  Select,
  Stack,
  TextInput,
  PasswordInput,
  Modal,
} from '@bubbles-ui/components';
import { EMAIL_REGEX } from '@bubbles-ui/leemons';
import { Controller, useForm } from 'react-hook-form';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { activateUserRequest, sendWelcomeEmailToUserRequest, recoverRequest } from '@users/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';

function PersonalInformation({ t, user, form, config, isEditMode, store, render }) {
  const [tp] = useTranslateLoader(prefixPN('create_users'));
  const [activeModalOpened, setActiveModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const password = watch('password');
  const repeatPassword = watch('repeatPassword');

  const toggleModal = () => {
    setActiveModalOpened(!activeModalOpened);
  };

  const sendActivationEmail = () => {
    try {
      sendWelcomeEmailToUserRequest({ user: store.user });
      addSuccessAlert(t('activationEmailSent'));
    } catch (err) {
      addErrorAlert(err);
    }
  };

  const sendRecoveryLink = () => {
    try {
      recoverRequest({ email: store.user.email });
      addSuccessAlert(t('recoveryEmailSent'));
    } catch (err) {
      addErrorAlert(err);
    }
  };

  const activeUserManually = () => {
    handleSubmit(async ({ password: userPassword }) => {
      setLoading(true);
      try {
        await activateUserRequest({ id: user.id, password: userPassword });
        addSuccessAlert(t('activatedUser'));
        toggleModal();
        setLoading(false);
        store.isActived = true;
        render();
      } catch (err) {
        addErrorAlert(err);
        setLoading(false);
      }
    })();
  };

  return (
    <Grid columns={100}>
      <Col span={35}>
        <InputWrapper label={t('personalInformationLabel')} />
      </Col>
      <Col span={65}>
        <ContextContainer>
          <Controller
            name="user.email"
            control={form.control}
            rules={{
              required: tp('emailHeaderRequired'),
              pattern: { value: EMAIL_REGEX, message: tp('emailHeaderNotEmail') },
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                error={get(form.formState.errors, 'user.email')}
                label={tp('emailHeader')}
                disabled={!isEditMode}
                required
              />
            )}
          />
          <Box>
            <TextInput label={tp('passwordHeader')} disabled={true} />
            <Stack fullWidth direction="column" alignItems="flex-end">
              {store.isActived && (
                <Button variant="link" onClick={sendRecoveryLink}>
                  {t('recoveryLink')}
                </Button>
              )}
              {!store.isActived && (
                <Stack direction="column" alignItems="flex-end">
                  <Button variant="link" onClick={sendActivationEmail}>
                    {t('sendActivationEmail')}
                  </Button>
                  <Button variant="link" onClick={toggleModal} loading={loading}>
                    {t('manualActivation')}
                  </Button>
                </Stack>
              )}
            </Stack>
            <Modal opened={activeModalOpened} onClose={toggleModal} withCloseButton={false}>
              <Stack fullWidth direction="column" spacing={4}>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: t('requiredPassword'),
                    validate: () => {
                      if (password !== repeatPassword) return t('passwordNotMatch');
                      return true;
                    },
                  }}
                  shouldUnregister
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      label={t('provisionalPassword')}
                      error={errors.password}
                    />
                  )}
                />
                <Controller
                  name="repeatPassword"
                  control={control}
                  rules={{
                    required: t('requiredPassword'),
                    validate: () => {
                      if (password !== repeatPassword) return t('passwordNotMatch');
                      return true;
                    },
                  }}
                  shouldUnregister
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      label={t('repeatPassword')}
                      error={errors.repeatPassword}
                    />
                  )}
                />
              </Stack>
              <Stack fullWidth spacing={6} style={{ marginTop: 16 }} justifyContent="space-between">
                <Button onClick={toggleModal}>{t('cancel')}</Button>
                <Button onClick={activeUserManually}>{t('activeUser')}</Button>
              </Stack>
            </Modal>
          </Box>
          <Controller
            name="user.name"
            control={form.control}
            rules={{
              required: tp('nameHeaderRequired'),
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                error={get(form.formState.errors, 'user.name')}
                label={tp('nameHeader')}
                disabled={!isEditMode}
                required
              />
            )}
          />
          <Controller
            name="user.surnames"
            control={form.control}
            rules={{
              required: tp('surnameHeaderRequired'),
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                error={get(form.formState.errors, 'user.surnames')}
                label={tp('surnameHeader')}
                disabled={!isEditMode}
                required
              />
            )}
          />
          {config.secondSurname && !config.secondSurname.disabled ? (
            <Controller
              name="user.secondSurname"
              control={form.control}
              rules={
                config.secondSurname.required ? { required: tp('secondSurnameHeaderRequired') } : {}
              }
              render={({ field }) => (
                <TextInput
                  {...field}
                  error={get(form.formState.errors, 'user.secondSurname')}
                  label={tp('secondSurnameHeader')}
                  disabled={!isEditMode}
                  required={config.secondSurname.required}
                />
              )}
            />
          ) : null}
          <Controller
            name="user.birthdate"
            control={form.control}
            rules={{
              required: tp('birthdayHeaderRequired'),
            }}
            render={({ field }) => (
              <DatePicker
                {...field}
                error={get(form.formState.errors, 'user.birthdate')}
                label={tp('birthdayHeader')}
                disabled={!isEditMode}
                required
              />
            )}
          />
          <Controller
            name="user.gender"
            control={form.control}
            rules={{
              required: tp('genderHeaderRequired'),
            }}
            render={({ field }) => (
              <Select
                {...field}
                error={get(form.formState.errors, 'user.gender')}
                data={[
                  { label: tp('male'), value: 'male' },
                  { label: tp('female'), value: 'female' },
                ]}
                label={tp('genderHeader')}
                disabled={!isEditMode}
                required
              />
            )}
          />
        </ContextContainer>
      </Col>
    </Grid>
  );
}

PersonalInformation.propTypes = {
  user: PropTypes.object,
  t: PropTypes.func,
  form: PropTypes.object,
  config: PropTypes.object,
  isEditMode: PropTypes.bool,
  store: PropTypes.object,
  render: PropTypes.func,
};

export default PersonalInformation;
