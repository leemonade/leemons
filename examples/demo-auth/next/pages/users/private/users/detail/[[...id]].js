import * as _ from 'lodash';
import { useSession } from '@users/session';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { goLoginPage } from '@users/navigate';

export default function ListProfiles() {
  useSession({ redirectTo: goLoginPage });

  const router = useRouter();
  console.log(router);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (_.isArray(router.query.id)) {
      // router.query.id[0]
    }
  }, [router]);

  useEffect(() => {}, []);

  const onSubmit = (data) => {};

  return (
    <>
      <div className="mb-3">Detalle perfil</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Nombre</label>
          <input {...register('name', { required: true })} />
          {errors.name && <span>name is required</span>}
        </div>

        <input type="submit" />
      </form>
    </>
  );
}
