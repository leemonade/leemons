import * as _ from 'lodash';
import useTranslate, { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTranslationKey as getTranslationKeyActions } from '@users/actions/getTranslationKey';
import { getTranslationKey as getTranslationKeyPermissions } from '@users/permissions/getTranslationKey';
import {
  addProfileRequest,
  getProfileRequest,
  listActionsRequest,
  listPermissionsRequest,
  updateProfileRequest,
} from '@users/request';
import { withLayout } from '@layout/hoc';
import { goDetailProfilePage, goListProfilesPage, goLoginPage } from '@users/navigate';
import { PageContainer, PageHeader, Textarea } from 'leemons-ui';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@users/helpers/prefixPN';

function ProfileDetail() {
  useSession({ redirectTo: goLoginPage });

  const [translations] = useTranslate({ keysStartsWith: prefixPN('detail_profile') });
  const t = tLoader(prefixPN('detail_profile'), translations);
  const { t: tCommonHeader } = useCommonTranslate('page_header');
  const { t: tCommonForm } = useCommonTranslate('forms');

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
    const response = await listPermissionsRequest();
    const translate = await getLocalizationsByArrayOfItems(response.permissions, (permission) =>
      getTranslationKeyPermissions(permission.permissionName, 'name')
    );

    setPermissionT(translate);
    setPermissions(response.permissions);
  }

  async function getActions() {
    const response = await listActionsRequest();
    const translate = await getLocalizationsByArrayOfItems(response.actions, (action) =>
      getTranslationKeyActions(action.actionName, 'name')
    );
    console.log(translate);

    setActionT(translate);
    setActions(response.actions);
  }

  async function saveProfile(data) {
    console.log(data);
    let response;
    if (profile && profile.id) {
      response = await updateProfileRequest({
        ...data,
        id: profile.id,
      });
    } else {
      response = await addProfileRequest(data);
    }
    goDetailProfilePage(response.profile.uri);
  }

  async function getProfile(uri) {
    try {
      const response = await getProfileRequest(uri);

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <PageHeader
          title={''}
          registerFormTitle={register('name', { required: tCommonForm('required') })}
          registerFormTitleErrors={errors.title}
          titlePlaceholder={t('profile_name')}
          saveButton={tCommonHeader('save')}
          cancelButton={tCommonHeader('cancel')}
          onNewButton={goDetailProfilePage}
        />

        <div className="bg-primary-content">
          <PageContainer>
            <div className="flex flex-row max-w-screen-md">
              <div className="w-4/12 font-medium">{t('description')}</div>
              <div className="w-8/12">
                <Textarea className="w-full" outlined={true} {...register('description')} />
              </div>
            </div>
          </PageContainer>
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

export default withLayout(ProfileDetail);
