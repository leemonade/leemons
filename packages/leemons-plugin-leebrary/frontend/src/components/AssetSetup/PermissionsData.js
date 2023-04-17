import { SelectProgram } from '@academic-portfolio/components';
import { Alert, Box, Button, ContextContainer, Paper, Stack, Switch } from '@bubbles-ui/components';
import { LibraryItem } from '@bubbles-ui/leemons';
import { unflatten, useRequestErrorMessage } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useGetProfileSysName from '@users/helpers/useGetProfileSysName';
import { getCentersWithToken } from '@users/session';
import { isArray, isEmpty, isFunction, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import prefixPN from '../../helpers/prefixPN';
import { prepareAsset } from '../../helpers/prepareAsset';
import { getAssetRequest, setPermissionsRequest } from '../../request';
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
  const [t, translations] = isDrawer
    ? drawerTranslations
    : useTranslateLoader(prefixPN('assetSetup'));
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [adminPrograms, setAdminPrograms] = useState(assetProp.adminPrograms || []);
  const [isPublic, setIsPublic] = useState(adminPrograms.length || asset?.public);
  const params = useParams();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const profileSysName = useGetProfileSysName();

  // ··············································································
  // DATA PROCESS

  const loadAsset = async (id) => {
    const results = await getAssetRequest(id);
    if (results.asset && results.asset.id !== asset?.id) {
      setAsset(prepareAsset(results.asset));
    }
  };

  const savePermissions = async () => {
    try {
      setLoading(true);
      const canAccess = usersData
        .filter((item) => item.editable !== false)
        .map((userData) => ({
          userAgent: userData.user.value || userData.user.userAgentIds[0],
          role: userData.role,
        }));
      const classesCanAccess = selectedClasses.map((klass) => ({
        class: klass.class[0],
        role: klass.role,
      }));

      if (isFunction(onSavePermissions)) {
        await onSavePermissions(asset.id, {
          canAccess,
          programsCanAccess: isPublic ? adminPrograms : [],
          classesCanAccess,
          isPublic,
        });
      } else {
        await setPermissionsRequest(asset.id, {
          canAccess,
          programsCanAccess: isPublic ? adminPrograms : [],
          classesCanAccess,
          isPublic,
        });
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
  };

  // ··············································································
  // EFFECTS

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

  // ··············································································
  // RENDER

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
            <ContextContainer divided>
              {profileSysName === 'admin' ? (
                <PermissionsDataAdminCenterPrograms
                  roles={roles}
                  value={adminPrograms}
                  onChange={setAdminPrograms}
                  asset={asset}
                  t={t}
                  translations={translations}
                  profileSysName={profileSysName}
                />
                <Box>
                  <Switch
                    checked={isPublic}
                    onChange={setIsPublic}
                    label={t('permissionsData.labels.isPublic')}
                  />
                  {isPublic ? (
                    <SelectProgram
                      multiple
                      label={t('permissionsData.labels.program')}
                      center={getCentersWithToken()[0].id}
                      value={adminPrograms}
                      onChange={setAdminPrograms}
                    />
                  ) : null}
                </Box>
              ) : null}

              {!isPublic && (profileSysName === 'teacher' || profileSysName === 'student') && (
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
