import * as _ from 'lodash';
import constants from '@users-groups-roles/constants';
import { useSession } from '@users-groups-roles/session';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ListProfiles() {
  useSession({ redirectTo: constants.frontend.login });

  const router = useRouter();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [actions, setActions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [profile, setProfile] = useState(null);

  function goList() {
    return router.push(`/${constants.frontend.private.profiles.list}`);
  }

  async function getPermissions() {
    const response = await leemons.api(constants.backend.permissions.list);
    setPermissions(response.permissions);
  }

  async function getActions() {
    const response = await leemons.api(constants.backend.actions.list);
    setActions(response.actions);
  }

  async function saveProfile(data) {
    let response;
    if (profile && profile.id) {
      response = await leemons.api(constants.backend.profiles.update, {
        method: 'POST',
        body: {
          ...data,
          id: profile.id,
        },
      });
    } else {
      response = await leemons.api(constants.backend.profiles.add, {
        method: 'POST',
        body: data,
      });
    }
    router.push(`/${constants.frontend.private.profiles.detail}/${response.profile.uri}`);
  }

  async function getProfile(uri) {
    try {
      const response = await leemons.api({
        url: constants.backend.profiles.detail,
        query: {
          uri,
        },
      });

      setValue('name', response.profile.name);
      setValue('description', response.profile.description);
      _.forIn(response.profile.permissions, (value, key) => {
        setValue(`permissions.${key}`, value);
      });

      setProfile(response.profile);
    } catch (err) {
      console.error(err);
      await goList();
    }
  }

  useEffect(() => {
    if (_.isArray(router.query.id)) {
      getProfile(router.query.id[0]);
    }
  }, [router.query]);

  useEffect(() => {
    getPermissions();
    getActions();
  }, []);

  const onSubmit = (data) => {
    saveProfile(data);
  };

  return (
    <>
      <div className="mb-3">Detalle perfil</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Nombre</label>
          <input {...register('name', { required: true })} />
          {errors.name && <span>name is required</span>}
        </div>

        <div className="mb-3">
          <label>Description</label>
          <input type="description" {...register('description', { required: true })} />
          {errors.description && <span>description is required</span>}
        </div>

        <div className="mb-3">
          <div>Permisos</div>
          <table className="w-full">
            <thead>
              <tr>
                <th>Leemon</th>
                {actions.map((action) => (
                  <th key={action.id}>{action.actionName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td className="text-center">{permission.permissionName}</td>
                  {actions.map((action) => (
                    <td key={action.id} className="text-center">
                      {permission.actions.indexOf(action.actionName) >= 0 && (
                        <input
                          name={`permissions.${permission.permissionName}`}
                          value={action.actionName}
                          type="checkbox"
                          {...register(`permissions.${permission.permissionName}`)}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <input type="submit" />
      </form>
    </>
  );
}
