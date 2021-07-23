import { useSession } from '@users/session';
import { useForm } from 'react-hook-form';
import { loginRequest } from '@users/request';
import { goRecoverPage } from '@users/navigate';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import { Button, FormControl, HeroBg, ImageLoader, Input } from 'leemons-ui';
import prefixPN from '@users/helpers/prefixPN';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function Login() {
  useSession({ redirectTo: 'users/private/select-profile', redirectIfFound: true });
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
      const response = await loginRequest(data);
      Cookies.set('token', response.jwtToken);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex h-screen">
        <div className="relative flex">
          <HeroBg
            style={{ backgroundColor: '#F4E6E6' }}
            type="x-md"
            speed={500}
            className="h-full w-auto text-primary-200"
          />

          <div
            style={{ width: '294.58px', height: '414px' }}
            className="absolute right-20 bottom-20"
          >
            <ImageLoader src="/assets/login/child.png" />
          </div>

          <div className="absolute left-6 right-6 top-1/3 transform -translate-y-1/4 max-w-sm">
            <div className="text-3xl text-secondary italic">{t('hero_text')}</div>
            <div
              className="text-secondary text-xl mt-7"
              dangerouslySetInnerHTML={{
                __html: t('hero_author'),
              }}
            />
          </div>
        </div>
        <div className="w-7/12 relative">
          <div className="max-w-xs w-full absolute left-1/4 top-2/4 transform -translate-y-2/4">
            <h1 className="text-2xl mb-12">{t('title')}</h1>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email input */}
              <FormControl label={t('email')} className="mb-6">
                <Input
                  outlined={true}
                  placeholder={t('email')}
                  defaultValue="jaime@leemons.io"
                  {...register('email', { required: true })}
                />
              </FormControl>

              {/* Password input */}
              <FormControl label={t('password')}>
                <Input
                  outlined={true}
                  placeholder={t('password')}
                  defaultValue="testing"
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
