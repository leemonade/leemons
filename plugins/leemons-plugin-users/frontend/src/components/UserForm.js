import React from 'react';
import PropTypes from 'prop-types';
import { noop, trim } from 'lodash';
import {
  Box,
  Stack,
  Button,
  Select,
  TextInput,
  DatePicker,
  InputWrapper,
  LoadingOverlay,
  ContextContainer,
  ImageProfilePicker,
} from '@bubbles-ui/components';
import { Controller, useFormContext } from 'react-hook-form';
import { EMAIL_REGEX } from '@users/components/LoginForm';
import { activateUserRequest, sendWelcomeEmailToUserRequest } from '@users/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useUserDetails from '@users/hooks/useUserDetails';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useLocale } from '@common';
import prefixPN from '@users/helpers/prefixPN';
import { SetPasswordModal } from './SetPasswordModal';

const USER_FIELDS = ['email', 'name', 'surnames', 'secondSurname', 'gender', 'birthdate', 'avatar'];

function UserForm({ user, isAdminFirstTime, onCheckEmail = noop }) {
  const [reload, setReload] = React.useState(false);
  const [activeModalOpened, setActiveModalOpened] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const locale = useLocale();

  const enableUserDetails = !!user?.id;
  const {
    data: userDetails,
    refetch: updateUserDetails,
    isLoading,
  } = useUserDetails({
    userId: user?.id,
    enabled: enableUserDetails,
  });

  const form = useFormContext();
  const [t, , , tLoading] = useTranslateLoader(prefixPN('userForm'));

  const avatarUrl = userDetails?.user?.avatarAsset?.cover ? userDetails.user.avatar : null;

  // ····················································
  // INITIAL DATA

  React.useEffect(() => {
    if (form) {
      setReload(true);

      Object.keys(userDetails?.user ?? {}).forEach((key) => {
        form.setValue(key, userDetails.user[key]);
      });

      if (isAdminFirstTime) {
        form.setValue('birthdate', null);
        form.setValue('gender', null);
      }

      setTimeout(() => {
        setReload(false);
      }, 20);
    }
  }, [userDetails, isAdminFirstTime]);

  React.useEffect(() => {
    if (!user) {
      const classes = form.getValues('classes');
      form.reset({ classes });
    }
  }, [JSON.stringify(user)]);

  if (!form) return null;

  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const email = watch('email');
  const name = watch('name');
  const surnames = watch('surnames');
  const fullName = trim(`${name ?? ''} ${surnames ?? ''}`);

  function r(n) {
    return { required: t(n) };
  }

  // ····················································
  // HANDLERS

  const toggleModal = () => {
    setActiveModalOpened(!activeModalOpened);
  };

  const sendActivationEmail = () => {
    try {
      sendWelcomeEmailToUserRequest({ user: userDetails.user });
      addSuccessAlert(t('activationEmailSent'));
    } catch (err) {
      addErrorAlert(err);
    }
  };

  const activeUserManually = async (data) => {
    setLoading(true);
    try {
      await activateUserRequest({
        id: userDetails.user.id,
        password: data.password,
      });

      addSuccessAlert(t('activatedUser'));
      toggleModal();
      updateUserDetails();
      setLoading(false);
    } catch (err) {
      addErrorAlert(err);
      setLoading(false);
    }
  };

  // ····················································
  // RENDER

  if (reload || (enableUserDetails && isLoading) || tLoading) {
    return (
      <Box style={{ position: 'relative', height: 600 }}>
        <LoadingOverlay visible />
      </Box>
    );
  }

  const userNeedsActivation = !!userDetails?.user && !userDetails?.user?.active;

  return (
    <>
      <Stack direction="column" spacing={userNeedsActivation ? 4 : 6}>
        <ContextContainer title={t('accessInfo')} spacing={2}>
          <Stack fullWidth spacing={4}>
            <Box>
              <Controller
                name="email"
                control={control}
                rules={{
                  ...r('emailRequired'),
                  pattern: {
                    value: EMAIL_REGEX,
                    message: t('invalidEmail'),
                  },
                }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    required
                    label={t('email')}
                    error={errors.email}
                    disabled={!!userDetails?.user?.id}
                    onBlur={() => onCheckEmail(email)}
                    onChange={(e) => field.onChange(e.toLowerCase())}
                  />
                )}
              />
            </Box>
            {!userDetails?.user?.id && (
              <Box>
                <Controller
                  name="repeatEmail"
                  control={control}
                  rules={{
                    ...r('teacherEmailRequired'),
                    validate: (value) => {
                      if (value !== email) {
                        return t('emailNotMatch');
                      }
                      return true;
                    },
                  }}
                  shouldUnregister
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      required
                      label={t('repeatEmail')}
                      error={errors.repeatEmail}
                      onPaste={(e) => e.preventDefault()}
                      onChange={(e) => field.onChange(e.toLowerCase())}
                    />
                  )}
                />
              </Box>
            )}
          </Stack>
          {userNeedsActivation && (
            <Stack fullWidth direction="row">
              <Button variant="link" onClick={sendActivationEmail}>
                {t('sendActivationEmail')}
              </Button>
              <Button variant="link" onClick={toggleModal} loading={loading}>
                {t('manualActivation')}
              </Button>
            </Stack>
          )}
        </ContextContainer>

        <ContextContainer title={t('personalInfo')}>
          <Stack fullWidth spacing={4}>
            <Box>
              <Controller
                name="name"
                control={control}
                rules={r('nameRequired')}
                render={({ field }) => (
                  <TextInput {...field} required label={t('name')} error={errors.name} />
                )}
              />
            </Box>
            <Box>
              <Controller
                name="surnames"
                control={control}
                rules={r('surnameRequired')}
                render={({ field }) => (
                  <TextInput {...field} required label={t('surname')} error={errors.surnames} />
                )}
              />
            </Box>
          </Stack>

          <Box>
            <Controller
              name="secondSurname"
              control={control}
              render={({ field }) => <TextInput {...field} label={t('secondSurname')} />}
            />
          </Box>
          <Stack fullWidth spacing={4}>
            <Box>
              <Controller
                name="birthdate"
                control={control}
                rules={r('birthdayRequired')}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={field.value ? new Date(field.value) : null}
                    required
                    error={errors.birthdate}
                    label={t('birthday')}
                    locale={locale}
                  />
                )}
              />
            </Box>
            <Box>
              <Controller
                name="gender"
                control={control}
                rules={r('genderRequired')}
                render={({ field }) => (
                  <Select
                    {...field}
                    data={[
                      { label: t('male'), value: 'male' },
                      { label: t('female'), value: 'female' },
                      { label: t('other'), value: 'other' },
                    ]}
                    error={errors.gender}
                    label={t('gender')}
                    required
                  />
                )}
              />
            </Box>
          </Stack>

          <Box>
            <InputWrapper label={t('profilePicture')}>
              <Controller
                name="avatar"
                control={control}
                render={({ field }) => (
                  <ImageProfilePicker
                    {...field}
                    variant="compact"
                    url={avatarUrl}
                    fullName={fullName}
                    labels={{
                      uploadImage: t('uploadImage'),
                      changeImage: t('changeImage'),
                      delete: t('delete'),
                      cancel: t('cancel'),
                      accept: t('accept'),
                    }}
                  />
                )}
              />
            </InputWrapper>
          </Box>
        </ContextContainer>
      </Stack>

      <SetPasswordModal
        opened={activeModalOpened}
        onClose={toggleModal}
        onSave={activeUserManually}
      />
    </>
  );
}

UserForm.propTypes = {
  user: PropTypes.object,
  onCheckEmail: PropTypes.func,
  isAdminFirstTime: PropTypes.bool,
};

export { UserForm, USER_FIELDS };
