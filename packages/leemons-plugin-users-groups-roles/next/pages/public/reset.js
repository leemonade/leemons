import { useSession } from '@users-groups-roles/session';
import constants from '@users-groups-roles/constants';
import { useForm } from 'react-hook-form';
import Router from 'next/router';
import { useEffect } from 'react';

export default function Reset() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });

  function getToken() {
    const query = new URLSearchParams(window.location.search);
    return query.get('token');
  }

  async function canReset() {
    try {
      const response = await leemons.api(constants.backend.users.canReset, {
        method: 'POST',
        body: {
          token: getToken(),
        },
      });
      return response.can;
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
      const response = await leemons.api(constants.backend.users.reset, {
        method: 'POST',
        body: {
          token: getToken(),
          password: data.password,
        },
      });
      console.log(response);
      Router.push(`/${constants.frontend.login}`);
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
