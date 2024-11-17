import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Stack, Button, PasswordInput } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { Controller, useForm } from 'react-hook-form';
import { noop } from 'lodash';

function SetPasswordModal({ opened, onClose = noop, onSave = noop }) {
  const [t] = useTranslateLoader(prefixPN('userForm'));
  const form = useForm();

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const password = watch('password');

  return (
    <Modal opened={opened} onClose={onClose} withCloseButton={false} title={t('manualActivation')}>
      <Stack fullWidth direction="column" spacing={4}>
        <Controller
          name="password"
          control={control}
          rules={{
            required: t('requiredPassword'),
          }}
          shouldUnregister
          render={({ field }) => (
            <PasswordInput {...field} label={t('provisionalPassword')} error={errors.password} />
          )}
        />
        <Controller
          name="repeatPassword"
          control={control}
          rules={{
            required: t('requiredPassword'),
            validate: (value) => {
              if (value !== password) {
                return t('passwordNotMatch');
              }
              return true;
            },
          }}
          shouldUnregister
          render={({ field }) => (
            <PasswordInput {...field} label={t('repeatPassword')} error={errors.repeatPassword} />
          )}
        />
      </Stack>
      <Stack fullWidth spacing={6} style={{ marginTop: 16 }} justifyContent="space-between">
        <Button variant="link" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button onClick={handleSubmit(onSave)}>{t('activeUser')}</Button>
      </Stack>
    </Modal>
  );
}

SetPasswordModal.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

export { SetPasswordModal };
