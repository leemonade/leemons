import { Box, ContextContainer, Paper, TabPanel, Tabs } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@users/helpers/prefixPN';
import { addRoleRequest, getRoleRequest, updateRoleRequest } from '@users/request';
import hooks from 'leemons-hooks';
import { forIn } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

// import MainMenuDropItem from '@menu-builder/components/mainMenu/mainMenuDropItem';
import { useHistory, useParams } from 'react-router-dom';
import { PermissionsTab } from '../../profiles/DetailProfile/PermissionsTab';

function RoleDetail() {
  const [translations] = useTranslate({ keysStartsWith: prefixPN('detail_roles') });
  const t = tLoader(prefixPN('detail_roles'), translations);
  const { t: tCommonHeader } = useCommonTranslate('page_header');

  const history = useHistory();
  const { uri } = useParams();

  const [editMode, setEditMode] = useState(false);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  useEffect(() => {
    if (!uri) {
      setEditMode(true);
    }
  }, []);

  async function saveRole({ name, description }) {
    try {
      setSaveLoading(true);
      let response;

      if (role && role.id) {
        const body = {
          name,
          description,
          id: role.id,
          permissions,
        };
        response = await updateRoleRequest(body);
        addSuccessAlert(t('update_done'));
      } else {
        response = await addRoleRequest({ ...role, name, description, permissions });
        addSuccessAlert(t('save_done'));
      }
      await hooks.fireEvent('user:update:permissions', role);
      setSaveLoading(false);
      setEditMode(false);
      history.push(`/private/users/roles/detail/${response.role.uri}`);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
      setSaveLoading(false);
    }
  }

  async function getRole(_uri) {
    try {
      setLoading(true);
      const response = await getRoleRequest(_uri);
      const perms = [];
      forIn(response.role.permissions, (actionNames, permissionName) => {
        perms.push({ actionNames, permissionName });
      });

      setPermissions(perms);
      setRole(response.role);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (uri) {
      getRole(uri);
      setEditMode(false);
    } else {
      setLoading(false);
    }
  }, [uri]);

  // ····················································································
  // HANDLERS

  const handleOnSave = (data) => {
    saveRole({ name: data.title, description: data.description });
  };

  const handleOnEdit = () => {
    setEditMode(true);
  };

  const handleOnCancel = () => {
    if (role?.id) {
      setEditMode(false);
    } else {
      history.push('/private/users/roles/list');
    }
  };

  // ····················································································
  // LITERALS

  const headerValues = useMemo(
    () => ({
      title: role?.name || '',
      description: role?.description || ' ',
    }),
    [role]
  );

  const headerPlaceholders = useMemo(
    () => ({
      title: t('role_name'),
      description: t('description'),
    }),
    [t]
  );

  const headerLabels = useMemo(
    () => ({
      title: t('role_name'),
      description: t('description'),
    }),
    [t]
  );

  const headerButtons = useMemo(
    () => ({
      save: editMode ? tCommonHeader('save') : null,
      cancel: editMode ? tCommonHeader('cancel') : null,
      edit: !editMode ? tCommonHeader('edit') : null,
    }),
    [tCommonHeader]
  );

  return (
    <>
      {!error && !loading ? (
        <ContextContainer fullHeight>
          <AdminPageHeader
            values={headerValues}
            labels={headerLabels}
            placeholders={headerPlaceholders}
            buttons={headerButtons}
            editMode={editMode}
            onCancel={handleOnCancel}
            onEdit={handleOnEdit}
            onSave={handleOnSave}
            loading={saveLoading && 'save'}
          />

          <Box style={{ flex: 1 }}>
            <Tabs usePageLayout={true} panelColor="solid" fullHeight>
              <TabPanel label={t('permissions')}>
                <Paper padding={2} mt={20} mb={20} fullWidth>
                  <PermissionsTab
                    t={t}
                    profile={role}
                    onPermissionsChange={setPermissions}
                    isEditMode={editMode}
                  />
                </Paper>
              </TabPanel>
              <TabPanel disabled={!role?.id} label={t('users')}>
                <Paper padding={2} mt={20} mb={20} fullWidth>
                  Uusarios a añadir y añadidos
                </Paper>
              </TabPanel>
            </Tabs>
          </Box>
        </ContextContainer>
      ) : (
        <ErrorAlert />
      )}
    </>
  );
}

export default RoleDetail;
