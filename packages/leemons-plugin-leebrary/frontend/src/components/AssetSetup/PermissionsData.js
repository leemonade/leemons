/* eslint-disable no-param-reassign */
import { classByIdsRequest, detailProgramRequest } from '@academic-portfolio/request';
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
import { getCentersWithToken } from '@users/session';
import _, { isArray, isEmpty, isFunction, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import prefixPN from '../../helpers/prefixPN';
import { prepareAsset } from '../../helpers/prepareAsset';
import { getAssetRequest, setPermissionsRequest } from '../../request';
import { PermissionsDataCenterProgramsProfiles } from './components/PermissionsDataCenterProgramsProfiles';
import { PermissionsDataClasses } from './components/PermissionsDataClasses';
import { PermissionsDataProfiles } from './components/PermissionsDataProfiles';
import { PermissionsDataPrograms } from './components/PermissionsDataPrograms';
import { PermissionsDataUsers } from './components/PermissionsDataUsers';

const ROLESBYROLE = {
  viewer: [
    { label: 'Owner', value: 'owner', disabled: true },
    { label: 'Viewer', value: 'viewer', disabled: true },
    { label: 'Assigner', value: 'assigner', disabled: true },
    { label: 'Editor', value: 'editor', disabled: true },
    // { label: 'Commentor', value: 'commentor' },
  ],
  editor: [
    { label: 'Owner', value: 'owner', disabled: true },
    { label: 'Viewer', value: 'viewer' },
    { label: 'Assigner', value: 'assigner' },
    { label: 'Editor', value: 'editor' },
    // { label: 'Commentor', value: 'commentor' },
  ],
  assigner: [
    { label: 'Owner', value: 'owner', disabled: true },
    { label: 'Viewer', value: 'viewer', disabled: true },
    { label: 'Assigner', value: 'assigner', disabled: true },
    { label: 'Editor', value: 'editor', disabled: true },
    // { label: 'Commentor', value: 'commentor' },
  ],
  owner: [
    { label: 'Owner', value: 'owner' },
    { label: 'Viewer', value: 'viewer' },
    { label: 'Editor', value: 'editor' },
    { label: 'Assigner', value: 'assigner' },
    // { label: 'Commentor', value: 'commentor' },
  ],
};

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
  const [editUsersData, setEditUsersData] = useState([]);
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
    if (permission.startsWith('plugins.academic-portfolio.class.')) {
      return { center: null, class: split[split.length - 1] };
    }
    if (permission.startsWith('plugins.academic-portfolio.class-profile.')) {
      return { center: null, class: split[split.length - 2], profile: split[split.length - 1] };
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
    const classesNeedCenter = [];
    _.forEach(Object.keys(asset.permissions), (role) => {
      _.forEach(asset.permissions[role], (permission) => {
        const obj = getObjectByPermission(permission);
        if (obj) {
          if (obj.center === null && obj.class) classesNeedCenter.push(obj.class);
          if (obj.center === null && obj.program) programsNeedCenter.push(obj.program);
          assetPermissions.push({ ...obj, role, editable: asset.role !== role });
        }
      });
    });

    const { classes } = await classByIdsRequest(_.uniq(classesNeedCenter));
    programsNeedCenter.push(..._.map(classes, 'program'));

    const programResponses = await Promise.all(
      _.map(_.uniq(programsNeedCenter), (program) => detailProgramRequest(program))
    );
    const classesById = _.keyBy(classes, 'id');
    const programsById = _.keyBy(_.map(programResponses, 'program'), 'id');

    _.forEach(assetPermissions, (assetPermission) => {
      if (assetPermission.center === null && assetPermission.program) {
        [assetPermission.center] = programsById[assetPermission.program].centers;
      }
      if (assetPermission.center === null && assetPermission.class) {
        [assetPermission.center] = programsById[classesById[assetPermission.class].program].centers;
      }
    });

    setEditPermission(assetPermissions);

    const { canAccess } = asset;
    if (isArray(canAccess)) {
      setEditUsersData(
        canAccess.map((user) => ({
          user,
          role: user.permissions[0],
          // eslint-disable-next-line no-prototype-builtins
          editable: user.hasOwnProperty('editable')
            ? user.editable
            : user.permissions[0] !== 'owner',
        }))
      );
    }
  }

  function calculePermission(permission) {
    if (permission.center !== '*' && permission.program && permission.profile) {
      return `plugins.academic-portfolio.program-profile.inside.${permission.program}.${permission.profile}`;
    }
    if (permission.center !== '*' && permission.profile && permission.class) {
      return `plugins.academic-portfolio.class-profile.${permission.class}.${permission.profile}`;
    }
    if (permission.center !== '*' && permission.class) {
      return `plugins.academic-portfolio.class.${permission.class}`;
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

  function getPermissionsToSave(perms) {
    const result = {
      viewer: [],
      editor: [],
      assigner: [],
      isPublic: false,
    };
    _.forEach(perms, (permission) => {
      const calculedPermission = calculePermission(permission);
      if (calculedPermission !== '*') {
        result[permission.role].push(calculedPermission);
      } else {
        result.isPublic = true;
      }
    });

    // Si es publico borramos el resto de permisos de ver
    if (result.isPublic) {
      result.viewer = [];
    }

    return result;
  }

  async function savePermissions() {
    try {
      if (store.shareType) {
        setLoading(true);
        const canAccess = usersData
          .filter((item) => item.editable !== false)
          .map((userData) => ({
            userAgent: userData.user.value || userData.user.userAgentIds[0],
            role: userData.role,
          }));

        const { isPublic, ..._permissions } = getPermissionsToSave(permissions);

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
      }

      onNext();
    } catch (err) {
      console.error('Error saving permissions', err);
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  }

  async function saveEditPermissions() {
    try {
      setLoading(true);
      const canAccess = editUsersData
        .filter((item) => item.editable !== false)
        .map((userData) => ({
          userAgent: userData.user.value || userData.user.userAgentIds[0],
          role: userData.role,
        }));

      const { isPublic, ..._permissions } = getPermissionsToSave(editPermissions);

      const toSend = {
        canAccess,
        permissions: _permissions,
        isPublic,
        deleteMissing: true,
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
      console.error('Error editing permissions', err);
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  }

  async function load() {
    if (profileSysName === 'admin') {
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
        store.centers = getCentersWithToken();
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
    } else {
      store.centers = getCentersWithToken();
    }
  }

  // ··············································································
  // EFFECTS

  useEffect(() => {
    if (asset) loadAssetPermissions();
  }, [asset]);

  useEffect(() => {
    if (profileSysName) load();
  }, [profileSysName]);

  useEffect(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const { roleLabels } = items.plugins.leebrary.assetSetup;
      const ROLES = ROLESBYROLE[asset?.role || 'owner'];
      ROLES.forEach((rol, index) => {
        ROLES[index].label = roleLabels[rol.value] || ROLES[index].label;
      });
      setRoles(ROLES);
    }
  }, [translations, asset?.role]);

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
        result.push({ label: t('permissionsData.labels.shareTypeProfiles'), value: 'profiles' });
      }
    }
    if (profileSysName === 'teacher') {
      result.push({ label: t('permissionsData.labels.shareTypeClasses'), value: 'classes' });
      result.push({ label: t('permissionsData.labels.shareTypeUsers'), value: 'users' });
    }

    if (profileSysName === 'student') {
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
                    <PermissionsDataCenterProgramsProfiles
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
                  {store.shareType === 'programs' ? (
                    <PermissionsDataPrograms
                      roles={roles}
                      value={permissions}
                      onChange={setPermissions}
                      profiles={store.profiles}
                      centers={store.centers}
                      t={t}
                    />
                  ) : null}
                  {store.shareType === 'profiles' ? (
                    <PermissionsDataProfiles
                      roles={roles}
                      value={permissions}
                      onChange={setPermissions}
                      profiles={store.profiles}
                      centers={store.centers}
                      t={t}
                    />
                  ) : null}
                  {store.shareType === 'classes' ? (
                    <PermissionsDataClasses
                      roles={roles}
                      value={permissions}
                      onChange={setPermissions}
                      profiles={store.profiles}
                      centers={store.centers}
                      asset={asset}
                      t={t}
                      profileSysName={profileSysName}
                    />
                  ) : null}
                  {store.shareType === 'users' ? (
                    <PermissionsDataUsers
                      roles={roles}
                      value={usersData}
                      alreadySelectedUsers={editUsersData}
                      onChange={setUsersData}
                      asset={asset}
                      t={t}
                    />
                  ) : null}
                </Box>
                <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                  <Stack justifyContent={'end'} fullWidth>
                    <Button loading={loading} onClick={savePermissions}>
                      {sharing
                        ? t('permissionsData.labels.shareButton')
                        : t('permissionsData.labels.saveButton')}
                    </Button>
                  </Stack>
                </Box>
              </TabPanel>
              <TabPanel label={t('permissionsData.labels.sharedTab')}>
                <Box
                  sx={(theme) => ({
                    flexDirection: 'column',
                    display: 'flex',
                    gap: theme.spacing[4],
                    marginTop: theme.spacing[4],
                  })}
                >
                  {shareTypesValues.includes('centers') ? (
                    <PermissionsDataCenterProgramsProfiles
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
                  {shareTypesValues.includes('programs') ? (
                    <PermissionsDataPrograms
                      roles={roles}
                      value={editPermissions}
                      onChange={setEditPermission}
                      profiles={store.profiles}
                      centers={store.centers}
                      editMode
                      t={t}
                    />
                  ) : null}
                  {shareTypesValues.includes('profiles') ? (
                    <PermissionsDataProfiles
                      roles={roles}
                      value={editPermissions}
                      onChange={setEditPermission}
                      profiles={store.profiles}
                      centers={store.centers}
                      editMode
                      t={t}
                    />
                  ) : null}
                  {shareTypesValues.includes('classes') ? (
                    <PermissionsDataClasses
                      roles={roles}
                      value={editPermissions}
                      onChange={setEditPermission}
                      profiles={store.profiles}
                      centers={store.centers}
                      t={t}
                      editMode
                    />
                  ) : null}
                  {shareTypesValues.includes('users') ? (
                    <PermissionsDataUsers
                      roles={roles}
                      value={editUsersData}
                      alreadySelectedUsers={[]}
                      onChange={setEditUsersData}
                      t={t}
                      editMode
                    />
                  ) : null}
                </Box>
                <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                  <Stack justifyContent={'end'} fullWidth>
                    <Button loading={loading} onClick={saveEditPermissions}>
                      {t('permissionsData.labels.saveButton')}
                    </Button>
                  </Stack>
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
