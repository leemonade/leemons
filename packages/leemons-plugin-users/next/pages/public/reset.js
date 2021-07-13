import { useSession } from '@users/session';
import constants from '@users/constants';
import { useForm } from 'react-hook-form';
import Router from 'next/router';
import { useEffect } from 'react';
import { canResetRequest, resetRequest } from '@users/request';
import { goLoginPage } from '@users/navigate';

export default function Reset() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });

  function getToken() {
    const query = new URLSearchParams(window.location.search);
    return query.get('token');
  }

  async function canReset() {
    try {
      const { can } = await canResetRequest(getToken());
      return can;
    } catch (err) {
      return false;
    }
  }

  async function checkIfCanResetIfNotRedirect() {
    const can = await canReset();
    if (!can) {
      alert('El token para resetear a caducado o no es valido');
      Router.push(`/${constants.base}`);
    }
  }

  useEffect(() => {
    if (!getToken()) Router.push(`/${constants.base}`);
    checkIfCanResetIfNotRedirect();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await resetRequest(getToken(), data.password);
      console.log(response);
      goLoginPage();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>New password</label>
          <input type="password" {...register('password', { required: true })} />
          {errors.password && <span>password is required</span>}
        </div>

        <input type="submit" />
      </form>
    </>
  );
}
