/* eslint-disable no-nested-ternary */
import prefixPN from '@admin/helpers/prefixPN';
import { getOrganizationRequest, updateOrganizationRequest } from '@admin/request/organization';
import {
  Box,
  Button,
  ColorInput,
  ContextContainer,
  NumberInput,
  Paragraph,
  PasswordInput,
  Stack,
  Switch,
  TextInput,
  Title,
  createStyles,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import hooks from 'leemons-hooks';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { EMAIL_REGEX } from '../../../../constants';

const Styles = createStyles((theme) => ({}));

const Note = ({ t, descriptionKey }) => (
  <Box mt={2}>
    <Title order={6}>{t('note')}</Title>
    <Paragraph>{t(descriptionKey)}</Paragraph>
  </Box>
);

Note.propTypes = {
  t: PropTypes.func.isRequired,
  descriptionKey: PropTypes.string.isRequired,
};

const Organization = ({ onNextLabel, onNext = () => {} }) => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('setup.organization'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const { openDeleteConfirmationModal } = useLayout();
  const {
    reset,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hostname: new URL(window.location.href).origin,
      hostnameApi: new URL(window.location.href).origin,
    },
  });

  const [store, render] = useStore({
    loading: true,
    selectedCenter: null,
  });

  const useDarkMode = watch('useDarkMode');

  async function load() {
    try {
      store.loading = true;
      render();
      const { organization } = await getOrganizationRequest();
      reset(organization);
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.loading = false;
    render();
  }

  React.useEffect(() => {
    load();
  }, []);

  const { classes: styles, cx } = Styles();

  async function onSubmit(data) {
    try {
      store.saving = true;
      render();
      await updateOrganizationRequest(data);
      hooks.fireEvent('platform:theme:change');
      onNext();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  function r(n) {
    return { required: t(n) };
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <ContextContainer title={t('title')} description={t('description')} divided>
          <ContextContainer>
            <Controller
              name="name"
              control={control}
              rules={r('organizationNameRequired')}
              render={({ field }) => (
                <TextInput label={t('organizationName')} error={errors.name} required {...field} />
              )}
            />

            <ContextContainer
              subtitle={t('domainUrlForInstallation')}
              description={<Note t={t} descriptionKey="domainUrlDescription" />}
            >
              <Controller
                name="hostname"
                control={control}
                rules={{
                  required: t('hostnameRequired'),
                  pattern: {
                    // Pattern check if start by http or https
                    value: /^(http|https):\/\//,
                    message: t('hostnameInvalid'),
                  },
                }}
                render={({ field }) => (
                  <TextInput label={t('hostname')} error={errors.hostname} required {...field} />
                )}
              />
              <Controller
                name="hostnameApi"
                control={control}
                rules={{
                  required: t('hostnameRequired'),
                  pattern: {
                    // Pattern check if start by http or https
                    value: /^(http|https):\/\//,
                    message: t('hostnameInvalid'),
                  },
                }}
                render={({ field }) => (
                  <TextInput
                    label={t('hostnameApi')}
                    error={errors.hostnameApi}
                    required
                    {...field}
                  />
                )}
              />
            </ContextContainer>
            <ContextContainer
              subtitle={t('lookAndFeel')}
              description={<Note t={t} descriptionKey="lookAndFeelDescription" />}
            >
              <Stack fullWidth spacing={6}>
                <Box>
                  <Box>
                    <Controller
                      name="logoUrl"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^(http|https):\/\//,
                          message: t('logoUrlInvalid'),
                        },
                      }}
                      render={({ field }) => (
                        <TextInput error={errors.logoUrl} label={t('logoUrl')} {...field} />
                      )}
                    />
                  </Box>
                  <Box mt={20}>
                    <Controller
                      name="squareLogoUrl"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^(http|https):\/\//,
                          message: t('logoUrlInvalid'),
                        },
                      }}
                      render={({ field }) => (
                        <TextInput
                          error={errors.squareLogoUrl}
                          label={t('squareLogoUrl')}
                          {...field}
                        />
                      )}
                    />
                  </Box>
                  <Box mt={20}>
                    <Controller
                      name="emailLogoUrl"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^(http|https):\/\//,
                          message: t('logoUrlInvalid'),
                        },
                      }}
                      render={({ field }) => (
                        <TextInput
                          error={errors.emailLogoUrl}
                          label={t('emailLogoUrl')}
                          {...field}
                        />
                      )}
                    />
                  </Box>
                  <Box mt={20}>
                    <Controller
                      name="emailWidthLogo"
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          error={errors.emailWidthLogo}
                          label={t('emailWidthLogo')}
                          {...field}
                        />
                      )}
                    />
                  </Box>
                </Box>
                <Box>
                  <Controller
                    name="mainColor"
                    control={control}
                    render={({ field }) => (
                      <ColorInput
                        useHsl
                        error={errors.mainColor}
                        label={t('mainColor')}
                        {...field}
                      />
                    )}
                  />
                </Box>
              </Stack>
              <Box>
                <Controller
                  name="useDarkMode"
                  control={control}
                  render={({ field }) => (
                    <Switch {...field} label={t('useDarkMode')} checked={!!field.value} />
                  )}
                />
              </Box>
              {useDarkMode ? (
                <Stack fullWidth spacing={6}>
                  <Box>
                    <Controller
                      name="menuMainColor"
                      control={control}
                      render={({ field }) => (
                        <ColorInput
                          error={errors.menuMainColor}
                          label={t('menuMainColor')}
                          {...field}
                        />
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      name="menuDrawerColor"
                      control={control}
                      render={({ field }) => (
                        <ColorInput
                          error={errors.menuDrawerColor}
                          label={t('menuDrawerColor')}
                          {...field}
                        />
                      )}
                    />
                  </Box>
                </Stack>
              ) : null}
              <Box>
                <Controller
                  name="usePicturesEmptyStates"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      label={t('usePicturesEmptyStates')}
                      checked={!!field.value}
                    />
                  )}
                />
              </Box>
            </ContextContainer>
            <ContextContainer
              subtitle={t('superAdminCredentials')}
              description={<Note t={t} descriptionKey="superAdminCredentialsDescription" />}
            >
              <Stack fullWidth spacing={6}>
                <Box>
                  <Controller
                    name="email"
                    rules={{
                      required: t('emailRequired'),
                      pattern: {
                        value: EMAIL_REGEX,
                        message: t('emailInvalid'),
                      },
                    }}
                    control={control}
                    render={({ field }) => (
                      <TextInput error={errors.email} label={t('email')} required {...field} />
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput error={errors.password} label={t('password')} {...field} />
                    )}
                  />
                </Box>
              </Stack>
            </ContextContainer>
            <ContextContainer
              subtitle={t('administrativeContactInfo')}
              description={t('administrativeContactInfoDescription')}
            >
              <Stack fullWidth spacing={6}>
                <Box>
                  <Controller
                    name="contactPhone"
                    control={control}
                    render={({ field }) => (
                      <TextInput error={errors.contactPhone} label={t('phone')} {...field} />
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    name="contactEmail"
                    rules={{
                      pattern: {
                        value: EMAIL_REGEX,
                        message: t('emailInvalid'),
                      },
                    }}
                    control={control}
                    render={({ field }) => (
                      <TextInput error={errors.contactEmail} label={t('email')} {...field} />
                    )}
                  />
                </Box>
              </Stack>
              <Stack fullWidth spacing={6}>
                <Box>
                  <Controller
                    name="contactName"
                    control={control}
                    render={({ field }) => (
                      <TextInput error={errors.contactName} label={t('contactName')} {...field} />
                    )}
                  />
                </Box>
                <Box />
              </Stack>
            </ContextContainer>
          </ContextContainer>
          <Stack justifyContent="end">
            <Button type="submit" loading={store.saving}>
              {onNextLabel}
            </Button>
          </Stack>
        </ContextContainer>
      </form>
    </Box>
  );
};

Organization.defaultProps = {
  onNextLabel: 'Save and continue',
};
Organization.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { Organization };
export default Organization;
