import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Box, Button, ContextContainer, PasswordInput } from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import { RegisterPasswordFormStyles } from './RegisterPasswordForm.styles';

export const REGISTER_PASSWORD_FORM_DEFAULT_PROPS = {
  labels: {
    title: '',
    username: '',
    password: '',
    remember: '',
    login: '',
    signup: '',
  },
  placeholders: {
    username: '',
    password: '',
  },
  loading: false,
  formError: '',
};

const RegisterPasswordForm = ({
  labels,
  placeholders,
  errorMessages,
  formError,
  onSubmit,
  onValidationError,
  loading,
  useRouter,
  ...props
}) => {
  const { classes, cx } = RegisterPasswordFormStyles({});

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();

  const password = watch('password');
  const repeatPassword = watch('repeatPassword');

  return (
    <form
      onSubmit={handleSubmit((e) => {
        if (e.password === e.repeatPassword) {
          onSubmit(e);
        }
      })}
      autoComplete="off"
    >
      <ContextContainer title={labels.title}>
        {formError && (
          <Alert severity="error" closeable={false}>
            {formError}
          </Alert>
        )}

        <Controller
          name="password"
          control={control}
          rules={{
            required: errorMessages.password?.required,
          }}
          render={({ field }) => (
            <PasswordInput
              label={labels.password}
              placeholder={placeholders.password}
              error={
                isSubmitted && password !== repeatPassword
                  ? errorMessages.passwordMatch
                  : errors.password
              }
              required
              {...field}
            />
          )}
        />

        <Box>
          <Controller
            name="repeatPassword"
            control={control}
            rules={{
              required: errorMessages.repeatPassword?.required,
            }}
            render={({ field }) => (
              <PasswordInput
                label={labels.repeatPassword}
                placeholder={placeholders.repeatPassword}
                error={
                  isSubmitted && password !== repeatPassword
                    ? errorMessages.passwordMatch
                    : errors.repeatPassword
                }
                required
                {...field}
              />
            )}
          />
        </Box>

        <Box>
          <Button loading={loading} loaderPosition="right" type="submit" fullWidth>
            {labels.setPassword}
          </Button>
        </Box>
      </ContextContainer>
    </form>
  );
};

RegisterPasswordForm.defaultProps = REGISTER_PASSWORD_FORM_DEFAULT_PROPS;

RegisterPasswordForm.propTypes = {
  labels: PropTypes.shape({
    title: PropTypes.string,
    password: PropTypes.string,
    repeatPassword: PropTypes.string,
    setPassword: PropTypes.string,
  }),
  placeholders: PropTypes.shape({
    repeatPassword: PropTypes.string,
    password: PropTypes.string,
  }),
  errorMessages: PropTypes.shape({
    repeatPassword: PropTypes.any,
    password: PropTypes.any,
    passwordMatch: PropTypes.string,
  }),
  formError: PropTypes.string,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export { RegisterPasswordForm };
