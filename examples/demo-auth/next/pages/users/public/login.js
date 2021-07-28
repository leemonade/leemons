import * as _ from 'lodash';
import { getCookieToken, useSession } from '@users/session';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getRememberProfileRequest,
  getUserProfilesRequest,
  getUserProfileTokenRequest,
  loginRequest,
} from '@users/request';
import { goRecoverPage } from '@users/navigate';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { Alert, Button, FormControl, ImageLoader, Input } from 'leemons-ui';
import prefixPN from '@users/helpers/prefixPN';
import Link from 'next/link';
import Cookies from 'js-cookie';
import HeroBgLayout from '@users/layout/heroBgLayout';
import hooks from 'leemons-hooks';
import constants from '@users/constants';

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export default function Login() {
  useSession({
    redirectTo: _.isString(getCookieToken(true)) ? 'users/private/select-profile' : constants.base,
    redirectIfFound: true,
  });
  const [formStatus, setFormStatus] = useState('');

  const { t: tCommon } = useCommonTranslate('forms');

  const [translations] = useTranslate({ keysStartsWith: prefixPN('login') });
  const t = tLoader(prefixPN('login'), translations);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      setFormStatus('loading');
      const response = await loginRequest(data);

      try {
        // Comprobamos si tiene recordado un perfil
        const { profile } = await getRememberProfileRequest(response.jwtToken);
        if (profile) {
          // Si lo tiene sacamos el token para dicho perfil
          const { jwtToken } = await getUserProfileTokenRequest(profile.id, response.jwtToken);
          await hooks.fireEvent('user:change:profile', profile);
          response.jwtToken = jwtToken;
        } else {
          // Si no lo tiene sacamos todos los perfiles a los que tiene acceso para hacer login
          const { profiles } = await getUserProfilesRequest(response.jwtToken);
          // Si solo tiene un perfil hacemos login automaticamente con ese
          if (profiles.length === 1) {
            const { jwtToken } = await getUserProfileTokenRequest(
              profiles[0].id,
              response.jwtToken
            );
            await hooks.fireEvent('user:change:profile', profiles[0]);
            response.jwtToken = jwtToken;
          }
        }
      } catch (e) {}
      // Finalmente metemos el token
      Cookies.set('token', response.jwtToken);
    } catch (err) {
      if (_.isObject(err) && err.status === 401) setFormStatus('error-match');
      if (_.isObject(err) && err.status === 500) setFormStatus('unknown-error');
    }
  };

  return (
    <HeroBgLayout>
      <h1 className="text-2xl mb-12">{t('title')}</h1>

      {formStatus === 'error-match' || formStatus === 'unknown-error' ? (
        <Alert color="error mb-8 -mt-4">
          <div className="flex-1">
            <label>
              {formStatus === 'error-match' ? t('form_error') : tCommon('unknown_error')}
            </label>
          </div>
        </Alert>
      ) : null}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email input */}
        <FormControl formError={errors.email} label={t('email')} className="mb-6">
          <Input
            outlined={true}
            placeholder={t('email')}
            defaultValue="jaime@leemons.io"
            {...register('email', {
              required: tCommon('required'),
              pattern: {
                value: emailRegex,
                message: tCommon('email'),
              },
            })}
          />
        </FormControl>

        {/* Password input */}
        <FormControl formError={errors.password} label={t('password')}>
          <Input
            type="password"
            outlined={true}
            placeholder={t('password')}
            defaultValue="testing"
            {...register('password', { required: tCommon('required') })}
          />
        </FormControl>

        {/* Go recover page */}
        <div>
          <Link href={goRecoverPage(true)}>
            <a className="text-sm">{t('remember_password')}</a>
          </Link>
        </div>

        {/* Send form */}
        <Button
          className="my-8 btn-block"
          loading={formStatus === 'loading'}
          color="primary"
          rounded={true}
        >
          <div className="flex-1 text-left">{t('log_in')}</div>
          <div className="relative" style={{ width: '8px', height: '14px' }}>
            <ImageLoader src="/assets/svgs/chevron-right.svg" />
          </div>
        </Button>

        {/* Go register page */}
        {/*
                <div className="text-center text-sm text-primary">
                  <Link href="">
                    <a>{t('not_registered')}</a>
                  </Link>
                </div>
              */}
      </form>
    </HeroBgLayout>
  );
}
