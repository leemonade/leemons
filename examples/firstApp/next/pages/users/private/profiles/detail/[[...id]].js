import * as _ from 'lodash';
import constants from '@users/constants';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTranslationKey as getTranslationKeyActions } from '@users/actions/getTranslationKey';
import { getTranslationKey as getTranslationKeyPermissions } from '@users/permissions/getTranslationKey';
import { goDetailProfilePage, goListProfilesPage, goLoginPage } from '@users/navigate';

export default function ListProfiles() {
  useSession({ redirectTo: goLoginPage });

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
  const [actionT, setActionT] = useState({});
  const [permissionT, setPermissionT] = useState({});

  function goList() {
    return goListProfilesPage();
  }

  async function getPermissions() {
    const response = await leemons.api(constants.backend.permissions.list);
    setPermissionT(
      await getLocalizationsByArrayOfItems(
        response.permissions,
        (permission) => getTranslationKeyPermissions(permission.permissionName, 'name'),
        'en' // TODO Añadir idioma
      )
    );

    setPermissions(response.permissions);
  }

  async function getActions() {
    const response = await leemons.api(constants.backend.actions.list);

    setActionT(
      await getLocalizationsByArrayOfItems(
        response.actions,
        (action) => getTranslationKeyActions(action.actionName, 'name'),
        'en' // TODO Añadir idioma
      )
    );

    setActions(response.actions);
  }

  async function saveProfile(data) {
    console.log(data);
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
    goDetailProfilePage(response.profile.uri);
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
  }, [router]);

  useEffect(() => {
    getPermissions();
    getActions();
  }, []);

  const onSubmit = (_data) => {
    const data = _data;
    data.permissions = _.pickBy(data.permissions, _.identity);
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
                  <th key={action.id}>
                    {actionT[getTranslationKeyActions(action.actionName, 'name')]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr key={permission.id}>
                  <td className="text-center">
                    {permissionT[getTranslationKeyPermissions(permission.permissionName, 'name')]}
                  </td>
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
