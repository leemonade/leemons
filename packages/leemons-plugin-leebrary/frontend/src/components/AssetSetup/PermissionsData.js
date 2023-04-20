/* eslint-disable no-param-reassign */
import { detailProgramRequest } from '@academic-portfolio/request';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  Paper,
  Select,
  Stack,
  TabPanel,
  Tabs,
} from '@bubbles-ui/components';
import { LibraryItem } from '@bubbles-ui/leemons';
import { unflatten, useRequestErrorMessage, useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useGetProfileSysName from '@users/helpers/useGetProfileSysName';
import { listCentersRequest, listProfilesRequest } from '@users/request';
import _, { isArray, isEmpty, isFunction, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import prefixPN from '../../helpers/prefixPN';
import { prepareAsset } from '../../helpers/prepareAsset';
import { getAssetRequest, setPermissionsRequest } from '../../request';
import { PermissionsDataAdminCenterPrograms } from './components/PermissionsDataAdminCenterPrograms';
import { PermissionsDataClasses } from './components/PermissionsDataClasses';
import { PermissionsDataUsers } from './components/PermissionsDataUsers';

const ROLES = [
  { label: 'Owner', value: 'owner' },
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
  { label: 'Commentor', value: 'commentor' },
];

const PermissionsData = ({
  asset: assetProp,
  sharing,
  onNext = () => {},
  onSavePermissions,
  isDrawer,
  drawerTranslations,
}) => {
  const [asset, setAsset] = useState(assetProp);
  const [roles, setRoles] = useState([]);
  const { openConfirmationModal } = useLayout();
  const [t, translations] = isDrawer
    ? drawerTranslations
    : useTranslateLoader(prefixPN('assetSetup'));
  const [store, render] = useStore({ centers: [] });
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [permissions, setPermissions] = useState(assetProp?.adminPrograms || []);
  const [editPermissions, setEditPermission] = useState([]);
  const params = useParams();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const profileSysName = useGetProfileSysName();

  // ··············································································
  // DATA PROCESS

  async function loadAsset(id) {
    const results = await getAssetRequest(id);
    if (results.asset && results.asset.id !== asset?.id) {
      setAsset(prepareAsset(results.asset));
    }
  }

  function getObjectByPermission(permission) {
    const split = permission.split('.');
    if (permission.startsWith('plugins.academic-portfolio.program-profile.inside.')) {
      return { center: null, program: split[split.length - 2], profile: split[split.length - 1] };
    }
    if (permission.startsWith('plugins.academic-portfolio.program.inside.')) {
      return { center: null, program: split[split.length - 1] };
    }
    if (permission.startsWith('plugins.users.center-profile.inside.')) {
      return { center: split[split.length - 2], profile: split[split.length - 1] };
    }
    if (permission.startsWith('plugins.users.center.inside.')) {
      return { center: split[split.length - 1] };
    }
    if (permission.startsWith('plugins.users.profile.inside.')) {
      return { center: '*', profile: split[split.length - 1] };
    }
    return null;
  }

  async function loadAssetPermissions() {
    const assetPermissions = [];
    const programsNeedCenter = [];
    _.forEach(Object.keys(asset.permissions), (role) => {
      _.forEach(asset.permissions[role], (permission) => {
        const obj = getObjectByPermission(permission);
        if (obj) {
          if (obj.center === null && obj.program) programsNeedCenter.push(obj.program);
          assetPermissions.push({ role, ...obj });
        }
      });
    });

    const responses = await Promise.all(
      _.map(_.uniq(programsNeedCenter), (program) => detailProgramRequest(program))
    );
    const programsById = _.keyBy(_.map(responses, 'program'), 'id');

    _.forEach(assetPermissions, (assetPermission) => {
      if (assetPermission.center === null && assetPermission.program) {
        [assetPermission.center] = programsById[assetPermission.program].centers;
      }
    });

    setEditPermission(assetPermissions);
  }

  function calculePermission(permission) {
    if (permission.center !== '*' && permission.program && permission.profile) {
      return `plugins.academic-portfolio.program-profile.inside.${permission.program}.${permission.profile}`;
    }
    if (permission.center !== '*' && permission.program) {
      return `plugins.academic-portfolio.program.inside.${permission.program}`;
    }
    if (permission.center !== '*' && permission.profile) {
      return `plugins.users.center-profile.inside.${permission.center}.${permission.profile}`;
    }
    if (permission.center !== '*') {
      return `plugins.users.center.inside.${permission.center}`;
    }
    if (permission.center === '*' && permission.profile) {
      return `plugins.users.profile.inside.${permission.profile}`;
    }
    if (permission.center === '*') {
      return '*';
    }
    return null;
  }

  function getPermissionsToSave() {
    const result = {
      viewer: [],
      editor: [],
      isPublic: false,
    };
    if (store.shareType === 'centers') {
      _.forEach(permissions, (permission) => {
        const calculedPermission = calculePermission(permission);
        if (calculedPermission !== '*') {
          result[permission.role].push(calculedPermission);
        } else {
          result.isPublic = true;
        }
      });
    }

    // Si es publico borramos el resto de permisos de ver
    if (result.isPublic) {
      result.viewer = [];
    }

    return result;
  }

  async function savePermissions() {
    try {
      setLoading(true);
      const canAccess = usersData
        .filter((item) => item.editable !== false)
        .map((userData) => ({
          userAgent: userData.user.value || userData.user.userAgentIds[0],
          role: userData.role,
        }));

      const { isPublic, ..._permissions } = getPermissionsToSave();

      const toSend = {
        canAccess,
        permissions: _permissions,
        isPublic,
      };

      if (isFunction(onSavePermissions)) {
        await onSavePermissions(asset.id, toSend);
      } else {
        await setPermissionsRequest(asset.id, toSend);
      }

      setLoading(false);
      addSuccessAlert(
        sharing
          ? t(`permissionsData.labels.shareSuccess`)
          : t(`permissionsData.labels.permissionsSuccess`)
      );
      onNext();
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  }

  async function load() {
    try {
      const {
        data: { items: centers },
      } = await listCentersRequest({
        page: 0,
        size: 999999,
      });
      store.centers = centers;
      render();
    } catch (e) {
      // Nothing to do
    }
    try {
      const {
        data: { items: profiles },
      } = await listProfilesRequest({
        page: 0,
        size: 9999,
      });
      store.profiles = profiles;
      render();
    } catch (e) {
      // Nothing to do
    }
  }

  // ··············································································
  // EFFECTS

  useEffect(() => {
    if (asset) loadAssetPermissions();
  }, [asset]);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const { roleLabels } = items.plugins.leebrary.assetSetup;
      ROLES.forEach((rol, index) => {
        ROLES[index].label = roleLabels[rol.value] || ROLES[index].label;
      });
      setRoles(ROLES);
    }
  }, [translations]);

  useEffect(() => {
    if (
      !isEmpty(params.asset) &&
      (isNil(asset) || (!isEmpty(asset) && asset.id !== params.asset))
    ) {
      loadAsset(params.asset);
    }
  }, [params]);

  const { shareTypes, shareTypesValues } = React.useMemo(() => {
    const result = [];
    if (profileSysName === 'admin') {
      result.push({ label: t('permissionsData.labels.shareTypePublic'), value: 'public' });
      if (store.centers.length > 1) {
        result.push({ label: t('permissionsData.labels.shareTypeCenters'), value: 'centers' });
      } else {
        result.push({ label: t('permissionsData.labels.shareTypePrograms'), value: 'programs' });
        result.push({ label: t('permissionsData.labels.shareTypeClasses'), value: 'classes' });
        result.push({ label: t('permissionsData.labels.shareTypeUsers'), value: 'users' });
      }
    }
    if (profileSysName === 'teacher') {
      result.push({ label: t('permissionsData.labels.shareTypePrograms'), value: 'programs' });
      result.push({ label: t('permissionsData.labels.shareTypeClasses'), value: 'classes' });
      result.push({ label: t('permissionsData.labels.shareTypeUsers'), value: 'users' });
    }

    if (profileSysName === 'student') {
      result.push({ label: t('permissionsData.labels.shareTypeClasses'), value: 'classes' });
      result.push({ label: t('permissionsData.labels.shareTypeUsers'), value: 'users' });
    }

    return {
      shareTypes: result,
      shareTypesValues: _.map(result, 'value'),
    };
  }, [profileSysName, translations, store.centers]);

  function onChangeShareType(shareType) {
    if (permissions?.length) {
      openConfirmationModal({
        title: 'Atención',
        description:
          'Tienes permisos sin guardar, estas seguro de que quieres cambiar de modo de compartir? (Se perderan los permisos no guardado)',
        onConfirm: () => {
          setPermissions([]);
          store.shareType = shareType;
          render();
        },
      })();
    } else {
      store.shareType = shareType;
      render();
    }
  }

  return (
    <Box>
      {!isEmpty(asset) && (
        <ContextContainer
          title={
            sharing ? t('permissionsData.header.shareTitle') : t('permissionsData.labels.title')
          }
        >
          <Paper bordered padding={1} shadow="none">
            <LibraryItem asset={asset} />
          </Paper>

          {isArray(asset?.canAccess) ? (
            <Tabs forceRender>
              <TabPanel label={t('permissionsData.labels.shareTab')}>
                <Select
                  sx={(theme) => ({ marginTop: theme.spacing[4], width: 270 })}
                  label={t('permissionsData.labels.shareTab')}
                  data={shareTypes || []}
                  value={store.shareType}
                  onChange={onChangeShareType}
                />

                <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                  {store.shareType === 'centers' ? (
                    <PermissionsDataAdminCenterPrograms
                      roles={roles}
                      value={permissions}
                      onChange={setPermissions}
                      asset={asset}
                      profiles={store.profiles}
                      centers={store.centers}
                      t={t}
                      translations={translations}
                      profileSysName={profileSysName}
                    />
                  ) : null}
                </Box>
                <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                  <Stack justifyContent={'end'} fullWidth>
                    <Button loading={loading} disabled={!store.shareType} onClick={savePermissions}>
                      {sharing
                        ? t('permissionsData.labels.shareButton')
                        : t('permissionsData.labels.saveButton')}
                    </Button>
                  </Stack>
                </Box>
              </TabPanel>
              <TabPanel label={t('permissionsData.labels.sharedTab')}>
                <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                  {shareTypesValues.includes('centers') ? (
                    <PermissionsDataAdminCenterPrograms
                      roles={roles}
                      value={editPermissions}
                      onChange={setEditPermission}
                      asset={asset}
                      profiles={store.profiles}
                      centers={store.centers}
                      t={t}
                      translations={translations}
                      profileSysName={profileSysName}
                      editMode
                    />
                  ) : null}
                </Box>
              </TabPanel>
            </Tabs>
          ) : (
            <Alert severity="error" closeable={false}>
              {t('permissionsData.errorMessages.share')}
            </Alert>
          )}

          {false ? (
            <>
              {isArray(asset?.canAccess) ? (
                <ContextContainer divided>
                  {!(profileSysName === 'teacher' || profileSysName === 'student') && (
                    <PermissionsDataClasses
                      roles={roles}
                      value={selectedClasses}
                      onChange={setSelectedClasses}
                      asset={asset}
                      t={t}
                      translations={translations}
                      profileSysName={profileSysName}
                    />
                  )}

                  <PermissionsDataUsers
                    roles={roles}
                    value={usersData}
                    onChange={setUsersData}
                    asset={asset}
                    t={t}
                    translations={translations}
                    profileSysName={profileSysName}
                  />

                  <Stack justifyContent={'end'} fullWidth>
                    <Button loading={loading} onClick={savePermissions}>
                      {sharing
                        ? t('permissionsData.labels.shareButton')
                        : t('permissionsData.labels.saveButton')}
                    </Button>
                  </Stack>
                </ContextContainer>
              ) : (
                <Alert severity="error" closeable={false}>
                  {t('permissionsData.errorMessages.share')}
                </Alert>
              )}
            </>
          ) : null}
        </ContextContainer>
      )}
    </Box>
  );
};

PermissionsData.propTypes = {
  asset: PropTypes.object,
  loading: PropTypes.bool,
  sharing: PropTypes.bool,
  onNext: PropTypes.func,
  onSavePermissions: PropTypes.func,
  isDrawer: PropTypes.bool,
  drawerTranslations: PropTypes.array,
};

export default PermissionsData;
export { PermissionsData };
