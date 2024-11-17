import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  PasswordInput,
  TextInput,
} from '@bubbles-ui/components';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@bubbles-ui/icons/outline';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { LoginFormStyles } from './LoginForm.styles';

export const LOGIN_FORM_DEFAULT_PROPS = {
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
  recoverUrl: '#',
  loading: false,
  formError: '',
  showSignup: false,
};

const EMAIL_REGEX =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;

const LoginForm = ({
  labels,
  placeholders,
  errorMessages,
  formError,
  onSubmit,
  onValidationError,
  loading,
  showSignup,
  recoverUrl,
  useRouter,
  ...props
}) => {
  const { classes, cx } = LoginFormStyles({});

  const defaultValues = {
    email: '',
    password: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const email = useWatch({
    control,
    name: 'email',
  });

  const recoveryProps = {};
  if (useRouter) {
    recoveryProps.as = Link;
    recoveryProps.to = recoverUrl + (email ? `?email=${email}` : '');
  } else {
    recoveryProps.as = 'a';
    recoveryProps.href = recoverUrl + (email ? `?email=${email}` : '');
  }
  const handleFormSubmit = (data) => {
    const dataParsed = {
      email: data.email.toLowerCase(),
      password: data.password,
    };
    onSubmit(dataParsed);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <ContextContainer title={labels.title} {...props} data-cypress-id="loginForm">
        {formError && (
          <Alert severity="error" closeable={false}>
            {formError}
          </Alert>
        )}

        <Controller
          name="email"
          control={control}
          rules={{
            required: errorMessages.username?.required,
            pattern: {
              value: EMAIL_REGEX,
              message: errorMessages.username?.invalidFormat,
            },
          }}
          render={({ field }) => (
            <TextInput
              {...field}
              data-cypress-id="emailInput"
              label={labels.username}
              placeholder={placeholders.username}
              error={errors.email}
              required
              onChange={(e) => field.onChange(e.toLowerCase().trim())}
            />
          )}
        />

        <Box>
          <Controller
            name="password"
            control={control}
            rules={{
              required: errorMessages.password?.required,
            }}
            render={({ field }) => (
              <PasswordInput
                data-cypress-id="passwordInput"
                label={labels.password}
                placeholder={placeholders.password}
                error={errors.password}
                required
                {...field}
              />
            )}
          />

          <Box mt={2}>
            <Button variant="link" {...recoveryProps}>
              {labels.remember}
            </Button>
          </Box>
        </Box>

        {/*
        <Box>
          <Controller
            name="center"
            control={control}
            rules={{
              required: errorMessages.passwordRequired,
            }}
            render={({ field }) => (
              <Select
                label="Select your center"
                placeholder="Pick one"
                clearable="Reset"
                data={[
                  { label: 'Centro 1', value: 1 },
                  { label: 'Centro 2', value: 2 },
                ]}
                error={errors.center}
                required
                {...field}
              />
            )}
          />
        </Box>
        */}

        <Box>
          <Button loading={loading} type="submit" fullWidth>
            {labels.login}
          </Button>
        </Box>
        {showSignup && (
          <Box>
            <Button variant="light" rightIcon={<ChevronRightIcon />} type="button" fullWidth>
              {labels.signup}
            </Button>
          </Box>
        )}
      </ContextContainer>
    </form>
  );
};

LoginForm.defaultProps = LOGIN_FORM_DEFAULT_PROPS;

LoginForm.propTypes = {
  labels: PropTypes.shape({
    title: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    remember: PropTypes.string,
    login: PropTypes.string,
    signup: PropTypes.string,
  }),
  placeholders: PropTypes.shape({
    username: PropTypes.string,
    password: PropTypes.string,
  }),
  errorMessages: PropTypes.shape({
    username: PropTypes.any,
    password: PropTypes.any,
  }),
  formError: PropTypes.string,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
  recoverUrl: PropTypes.string,
  useRouter: PropTypes.bool,
  showSignup: PropTypes.bool,
  onValidationError: PropTypes.func,
};

export { LoginForm, EMAIL_REGEX };
