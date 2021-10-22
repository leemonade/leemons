import React from 'react';
import { useSession } from '@users/session';
import constants from '@users/constants';
import { useForm } from 'react-hook-form';
import { recoverRequest } from '@users/request';
import { goLoginPage, goRegisterPage } from '@users/navigate';
import { useHistory } from 'react-router-dom';

export default function Recover() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });

  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await recoverRequest(data);
      alert('Te hemos enviado un email');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input defaultValue="jaime@leemons.io" {...register('email', { required: true })} />
          {errors.email && <span>email is required</span>}
        </div>

        <input type="submit" />
      </form>

      <div onClick={() => goLoginPage(history)}>Volver al login</div>
      <div onClick={() => goRegisterPage(history)}>Aun no estoy registrado</div>
    </>
  );
}
