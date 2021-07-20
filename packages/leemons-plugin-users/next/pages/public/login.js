import { loginSession, useSession } from '@users/session';
import constants from '@users/constants';
import { useForm } from 'react-hook-form';
import { loginRequest } from '@users/request';
import { goRecoverPage } from '@users/navigate';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import { Button, FormControl, Input } from 'leemons-ui';
import prefixPN from '@users/helpers/prefixPN';
import Link from 'next/link';

export default function Home() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });
  // TODO Ver de donde deberia de salir el locale cuando no se esta logado
  const [translations] = useTranslate({ keysStartsWith: prefixPN('login'), locale: 'en' });
  const t = tLoader(prefixPN('login'), translations);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await loginRequest(data);
      loginSession(response.jwtToken, 'users/private/select-profile');
    } catch (err) {
      console.error(err);
    }
  };

  console.log(errors);

  return (
    <>
      <div className="flex h-screen">
        <div className="w-5/12"></div>
        <div className="w-7/12 flex flex-col justify-center p-24">
          <div className="max-w-xs">
            <h1 className="text-2xl mb-12">{t('title')}</h1>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email input */}
              <FormControl label={t('email')} className="mb-6">
                <Input
                  outlined={true}
                  placeholder={t('email')}
                  {...register('email', { required: true })}
                />
              </FormControl>

              {/* Password input */}
              <FormControl label={t('password')}>
                <Input
                  outlined={true}
                  placeholder={t('password')}
                  {...register('password', { required: true })}
                />
              </FormControl>

              {/* Go recover page */}
              <div>
                <Link href={goRecoverPage(true)}>
                  <a className="text-sm">{t('remember_password')}</a>
                </Link>
              </div>

              {/* Send form */}
              <Button className="my-8 btn-block" color="primary" rounded={true}>
                <div>{t('log_in')}</div>
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
          </div>
        </div>
      </div>
    </>
  );
}
