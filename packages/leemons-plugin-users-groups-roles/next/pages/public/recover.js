import { getSession, useSession } from '@users-groups-roles/session';
import constants from '@users-groups-roles/constants';
import { useForm } from 'react-hook-form';
import Router from 'next/router';

export default function Recover() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await leemons.api(constants.backend.users.recover, {
        method: 'POST',
        body: data,
      });
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

      <div onClick={() => Router.push(`/${constants.frontend.login}`)}>Volver al login</div>
      <div onClick={() => Router.push(`/${constants.frontend.register}`)}>
        Aun no estoy registrado
      </div>
    </>
  );
}
export const getServerSideProps = async (context) => {
  return {
    props: {
      session: await getSession(context),
    },
  };
};
