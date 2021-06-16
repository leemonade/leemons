import { getSession, loginSession, useSession } from '@users-groups-roles/session';
import constants from '@users-groups-roles/constants';
import { useForm } from 'react-hook-form';

export default function Home() {
  useSession({ redirectTo: constants.base, redirectIfFound: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await leemons.api(constants.backend.login, {
        method: 'POST',
        body: data,
      });
      loginSession(response.jwtToken, constants.base);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input defaultValue="testing@test.io" {...register('email', { required: true })} />
        {errors.email && <span>email is required</span>}

        <label>Password</label>
        <input
          type="password"
          defaultValue="testing"
          {...register('password', { required: true })}
        />
        {errors.password && <span>password is required</span>}

        <input type="submit" />
      </form>
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
