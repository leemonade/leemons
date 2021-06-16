import { getSession, loginSession, logoutSession, useSession } from '@users-groups-roles/session';
import { useForm } from 'react-hook-form';

export default function Home() {
  const session = useSession('', '');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await leemons.api(`users-groups-roles/user/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      loginSession(response.jwtToken, '/');
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = () => {
    logoutSession('/');
  };

  return (
    <>
      <button onClick={logout}>Logout</button>
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
