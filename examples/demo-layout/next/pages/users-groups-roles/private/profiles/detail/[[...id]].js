import constants from '@users-groups-roles/constants';
import { useSession } from '@users-groups-roles/session';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

export default function ListProfiles() {
  useSession({ redirectTo: constants.frontend.login });
  const [actions, setActions] = useState([]);
  const [permissions, setPermissions] = useState([]);

  async function getPermissions() {
    const response = await leemons.api(constants.backend.permissions.list);
    console.log(response);
    setPermissions(response.permissions);
  }

  async function getActions() {
    const response = await leemons.api(constants.backend.actions.list);
    console.log(response);
    setActions(response.actions);
  }

  async function saveProfile(data) {
    const response = await leemons.api(constants.backend.profiles.add, {
      method: 'POST',
      body: data,
    });
    console.log(response);
  }

  useEffect(() => {
    getPermissions();
    getActions();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
