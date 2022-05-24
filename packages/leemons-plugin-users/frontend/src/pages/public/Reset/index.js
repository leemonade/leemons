import { useSession } from '@users/session';
import constants from '@users/constants';
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { canResetRequest, resetRequest } from '@users/request';
import { goLoginPage } from '@users/navigate';
import { useHistory } from 'react-router-dom';

export default function Reset() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });

  const history = useHistory();

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
      history.push(`/${constants.base}`);
    }
  }

  useEffect(() => {
    if (!getToken()) history.push(`/${constants.base}`);
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
      goLoginPage(history);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
