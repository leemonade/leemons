import React from 'react';
import { isEmpty } from 'lodash';
import { Box, Button, ContextContainer, TextInput, PasswordInput } from '@bubbles-ui/components';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { loginRequest, getUserProfilesRequest, getUserProfileTokenRequest } from '@users/request';
import prefixPN from '../../../helpers/prefixPN';
import { HeroWrapper } from '../../../components/HeroWrapper';
import { EMAIL_REGEX } from '../../../constants';

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [, translations] = useTranslateLoader(prefixPN(''));
  const history = useHistory();

  const t = React.useMemo(() => {
    const empty = { welcome: {}, signup: {} };

    if (!translations?.items) {
      return empty;
    }

    const items = unflatten(translations?.items);
    return items?.plugins?.admin || empty;
  }, [translations]);

  // ·····················································
  // FORM

  const defaultValues = {
    email: null,
    password: '',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // ·····················································
  // LOGIN

  const doLogin = async (data) => {
    setLoading(true);
    try {
      const response = await loginRequest(data);

      try {
        const { profiles } = await getUserProfilesRequest(response.jwtToken);
        if (profiles && !isEmpty(profiles)) {
          const { jwtToken } = await getUserProfileTokenRequest(profiles[0].id, response.jwtToken);

          response.jwtToken = { ...jwtToken, profile: profiles[0] };
        }
      } catch (e) {
        //
      }

      // Finalmente metemos el token
      Cookies.set('token', response.jwtToken);
      history.push('/private/admin/setup');

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // ·····················································
  // HANDLERS

  const handleOnSubmit = (data) => {
    doLogin(data);
  };

  // ·····················································
  // RENDER

  return (
    <HeroWrapper quote={{ q: t.welcome.quote?.title, a: t.welcome.quote?.description }}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <ContextContainer title={'Login as admin'}>
          <Box>
            <Controller
              control={control}
              name="email"
              rules={{
                required: t.signup.errorMessages?.email?.required || 'Field required',
                pattern: {
                  value: EMAIL_REGEX,
                  message: t.signup.errorMessages?.email?.invalidFormat || 'Invalid email format',
                },
              }}
              render={({ field }) => (
                <TextInput
                  label={t.signup.labels?.email}
                  placeholder={t.signup.placeholders?.email}
                  error={errors.email}
                  required
                  {...field}
                />
              )}
            />
          </Box>
          <Controller
            name="password"
            control={control}
            rules={{
              required: t.signup.errorMessages?.password?.required || 'Field required',
            }}
            render={({ field }) => (
              <PasswordInput
                label={t.signup.labels?.password}
                placeholder={t.signup.placeholders?.password}
                error={errors.password}
                required
                {...field}
              />
            )}
          />

          <Box>
            <Button type="submit" loading={loading}>
              {t.signup.labels?.nextButton}
            </Button>
          </Box>
        </ContextContainer>
      </form>
    </HeroWrapper>
  );
};

export default Login;
