import { getSession, loginSession, useSession } from '@users/session';
import constants from '@users/constants';
import { useForm } from 'react-hook-form';
import { goRecoverPage } from '@users/navigate';

export default function Home() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await leemons.api(constants.backend.users.login, {
        method: 'POST',
        body: data,
      });
      alert('Te ha logado bien');
      loginSession(response.jwtToken, constants.base);
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

        <div>
          <label>Password</label>
          <input
            type="password"
            defaultValue="testing"
            {...register('password', { required: true })}
          />
          {errors.password && <span>password is required</span>}
        </div>

        <input type="submit" />
      </form>

      <div onClick={goRecoverPage}>Recuperar contraseña</div>
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
