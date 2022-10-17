import React from 'react';
import {
  Box,
  Button,
  ContextContainer,
  Select,
  TextInput,
  PasswordInput,
  LoadingOverlay,
} from '@bubbles-ui/components';
import { isEmpty } from 'lodash';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { loginRequest, getUserProfilesRequest, getUserProfileTokenRequest } from '@users/request';
import prefixPN from '../../../helpers/prefixPN';
import { HeroWrapper } from '../../../components/HeroWrapper';
import { LOCALES, EMAIL_REGEX } from '../../../constants';
import LocaleContext from '../../../contexts/translations';
import { signupRequest } from '../../../request/settings';

const Signup = () => {
  const [loading, setLoading] = React.useState(false);
  const { locale } = React.useContext(LocaleContext);
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
    email: '',
    password: '',
    repeatPassword: '',
    locale,
  };

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({ defaultValues });

  const password = watch('password');
  const repeatPassword = watch('repeatPassword');

  // ·····················································
  // LOGIN

  const doLogin = async (data) => {
    try {
      const response = await loginRequest(data);

      try {
        // Si no tiene recordado un perfil, lo redirigimos a la selección de perfil
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
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // ·····················································
  // HANDLERS

  const handleOnSubmit = async (data) => {
    setLoading(true);
    try {
      await signupRequest(data);
      doLogin({ email: data.email, password: data.password });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // ·····················································
  // RENDER

  return (
    <HeroWrapper quote={{ q: t.welcome.quote?.title, a: t.welcome.quote?.description }}>
      <form
        onSubmit={handleSubmit((e) => {
          if (e.password === e.repeatPassword) {
            handleOnSubmit(e);
          }
        })}
        autoComplete="off"
      >
        {translations && !isEmpty(translations.items) ? (
          <ContextContainer title={t.signup.title} description={t.signup.description}>
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
                  error={
                    isSubmitted && password !== repeatPassword
                      ? t.signup.errorMessages?.password?.notMatch
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
                  required: t.signup.errorMessages?.repeatPassword?.required || 'Field required',
                }}
                render={({ field }) => (
                  <PasswordInput
                    label={t.signup.labels?.repeatPassword}
                    placeholder={t.signup.placeholders?.repeatPassword}
                    error={
                      isSubmitted && password !== repeatPassword
                        ? t.signup.errorMessages?.password?.notMatch
                        : errors.repeatPassword
                    }
                    required
                    {...field}
                  />
                )}
              />
            </Box>
            <Box>
              <Controller
                control={control}
                name="locale"
                rules={{
                  required: t.signup.errorMessages?.lang?.required || 'Field required',
                }}
                render={({ field }) => (
                  <Select
                    label={t.signup.labels?.lang}
                    placeholder={t.signup.placeholders?.lang}
                    data={LOCALES}
                    {...field}
                  />
                )}
              />
            </Box>
            <Box>
              <Button type="submit" loading={loading}>
                {t.signup.labels?.nextButton}
              </Button>
            </Box>
          </ContextContainer>
        ) : (
          <LoadingOverlay visible />
        )}
      </form>
    </HeroWrapper>
  );
};

export default Signup;
