import { useSession } from '@users/session';
import { useForm } from 'react-hook-form';
import { loginRequest } from '@users/request';
import { goRecoverPage } from '@users/navigate';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { Button, FormControl, ImageLoader, Input } from 'leemons-ui';
import prefixPN from '@users/helpers/prefixPN';
import Link from 'next/link';
import Cookies from 'js-cookie';
import HeroBgLayout from '@users/layout/heroBgLayout';

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export default function Login() {
  useSession({ redirectTo: 'users/private/select-profile', redirectIfFound: true });
  const { t: tCommon } = useCommonTranslate('formValidations');
  const [translations] = useTranslate({ keysStartsWith: prefixPN('login') });
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
    <HeroBgLayout>
      <h1 className="text-2xl mb-12">{t('title')}</h1>

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
        <Button className="my-8 btn-block" color="primary" rounded={true}>
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
