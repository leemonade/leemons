import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Alert, Box, Button, ContextContainer, PasswordInput } from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';
import { PASSWORD_POLICIES, PasswordChecklist } from '../PasswordChecklist';

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
  loading,
  onValidationError,
  useRouter,
}) => {
  const [passwordIsValid, setPasswordIsValid] = useState(false);

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
        if (passwordIsValid && e.password === e.repeatPassword) {
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
            validate: {
              password: (value) => {
                if (value.length < PASSWORD_POLICIES.MIN_LENGTH) {
                  return errorMessages.password?.minLength;
                }
                return true;
              },
            },
          }}
          render={({ field }) => (
            <Box>
              <PasswordInput
                {...field}
                required
                label={labels.password}
                placeholder={placeholders.password}
                error={
                  isSubmitted && password !== repeatPassword
                    ? errorMessages.passwordMatch
                    : errors.password
                }
              />
              {(!isEmpty(field.value) || !!errors.password) && (
                <Box style={{ marginTop: 10, display: passwordIsValid ? 'none' : 'block' }}>
                  <PasswordChecklist
                    labels={labels.checkList}
                    value={field.value}
                    valueAgain={watch('confirmPassword')}
                    onChange={setPasswordIsValid}
                  />
                </Box>
              )}
            </Box>
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
          <Button loading={loading} type="submit" fullWidth>
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
    checkList: PropTypes.shape({
      minLength: PropTypes.string,
      specialChar: PropTypes.string,
      number: PropTypes.string,
      capital: PropTypes.string,
    }),
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
  onValidationError: PropTypes.func,
  useRouter: PropTypes.func,
};

export { RegisterPasswordForm };
