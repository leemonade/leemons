import * as _ from 'lodash';
import useTranslate, { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
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
import {
  PageContainer,
  PageHeader,
  Tab,
  Table,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
} from 'leemons-ui';
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

  const [actions, setActions] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [profile, setProfile] = useState(null);
  const [actionT, setActionT] = useState(null);
  const [permissionT, setPermissionT] = useState(null);
  const [tableData, setTableData] = useState([]);

  const tableHeaders = useMemo(() => {
    const result = [
      {
        Header: t('leemon'),
        accessor: 'name',
        className: 'text-left',
      },
    ];
    if (actions && actionT) {
      _.forIn(actions, (action) => {
        result.push({
          Header: actionT[getTranslationKeyActions(action.actionName, 'name')],
          accessor: action.actionName,
          className: 'text-center',
        });
      });
    }
    return result;
  }, [actionT, actions, t]);

  useEffect(() => {
    if (_.isArray(router.query.id)) {
      getProfile(router.query.id[0]);
    }
  }, [router]);

  useEffect(() => {
    getPermissions();
    getActions();
  }, []);

  useEffect(() => {
    if (permissions && actions && permissionT) {
      setTableData(
        permissions.map((permission) => {
          const response = {
            name: permissionT[getTranslationKeyPermissions(permission.permissionName, 'name')],
            permissionName: permission.permissionName,
          };
          actions.map(({ actionName }) => {
            if (permission.actions.indexOf(actionName) >= 0) {
              response[actionName] = {
                type: 'checkbox',
                checked:
                  profile && profile.permissions[permission.permissionName]
                    ? profile.permissions[permission.permissionName].indexOf(actionName) >= 0
                    : false,
              };
            }
          });
          return response;
        })
      );
    }
  }, [profile, permissions, actions, permissionT]);

  function goList() {
    return goListProfilesPage();
  }

  async function getPermissions() {
    const response = await listPermissionsRequest();
    const translate = await getLocalizationsByArrayOfItems(response.permissions, (permission) =>
      getTranslationKeyPermissions(permission.permissionName, 'name')
    );

    setPermissionT(translate.items);
    setPermissions(response.permissions);
  }

  async function getActions() {
    const response = await listActionsRequest();
    const translate = await getLocalizationsByArrayOfItems(response.actions, (action) =>
      getTranslationKeyActions(action.actionName, 'name')
    );

    setActionT(translate.items);
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
      /*
      _.forIn(response.profile.permissions, (value, key) => {
        setValue(`permissions.${key}`, value);
      });
       */

      setProfile(response.profile);
    } catch (err) {
      console.error(err);
      await goList();
    }
  }

  const onSubmit = (data) => {
    const permissions = _.map(tableData, ({ name, permissionName, ...rest }) => {
      const actionNames = [];
      _.forIn(rest, ({ checked }, key) => {
        if (checked) actionNames.push(key);
      });
      return {
        permissionName,
        actionNames,
      };
    });

    saveProfile({ ...data, permissions });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PageHeader
          registerFormTitle={register('name', { required: tCommonForm('required') })}
          registerFormTitleErrors={errors.title}
          titlePlaceholder={t('profile_name')}
          saveButton={tCommonHeader('save')}
          cancelButton={tCommonHeader('cancel')}
          onNewButton={goDetailProfilePage}
          onCancelButton={goListProfilesPage}
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
      </form>

      <div className="bg-primary-content">
        <PageContainer>
          <Tabs>
            <TabList>
              <Tab id={`id-permissions`} panelId={`panel-permissions`}>
                {t('permissions')}
              </Tab>
              <Tab id={`id-dataset`} panelId={`panel-dataset`}>
                {t('dataset')}
              </Tab>
            </TabList>

            <TabPanel id={`panel-permissions`} tabId={`id-permissions`}>
              <div className="bg-primary-content py-8">
                <Table columns={tableHeaders} data={tableData} setData={setTableData} />
              </div>
            </TabPanel>

            <TabPanel id={`panel-dataset`} tabId={`id-dataset`}>
              <div className="bg-primary-content py-8">Dataset</div>
            </TabPanel>
          </Tabs>
        </PageContainer>
      </div>
    </>
  );
}

export default withLayout(ProfileDetail);
