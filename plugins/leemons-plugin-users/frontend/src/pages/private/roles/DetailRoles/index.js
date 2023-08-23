import {
  ActionButton,
  Avatar,
  Box,
  ContextContainer,
  Paper,
  TabPanel,
  Table,
  Tabs,
} from '@bubbles-ui/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import tLoader from '@multilanguage/helpers/tLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@users/helpers/prefixPN';
import { addRoleRequest, getRoleRequest, updateRoleRequest } from '@users/request';
import hooks from 'leemons-hooks';
import _, { forIn } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

// import MainMenuDropItem from '@menu-builder/components/mainMenu/mainMenuDropItem';
import { LocaleDate } from '@common';
import { SelectUserAgent } from '@users/components';
import getUserFullName from '@users/helpers/getUserFullName';
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
  const [users, setUsers] = useState([]);
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  useEffect(() => {
    if (!uri) {
      setEditMode(true);
    }
  }, []);

  async function saveRole({ name, description, userAgents }) {
    try {
      setSaveLoading(true);
      let response;

      if (role && role.id) {
        const body = {
          name,
          description,
          id: role.id,
          permissions,
          userAgents,
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

      const _users = _.map(response.role.userAgents, (item) => ({
        ...item.user,
        variant: 'rol',
        rol: item.profile?.name,
        center: item.center?.name,
        value: item.id,
        label: `${item.user.name}${item.user.surnames ? ` ${item.user.surnames}` : ''}`,
      }));
      setUsers(_users);
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
    saveRole({
      name: data.title,
      description: data.description,
      userAgents: _.map(users, 'value'),
    });
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

  const tableHeaders = useMemo(
    () => [
      {
        Header: ' ',
        accessor: 'avatar',
        className: 'text-left',
      },
      {
        Header: t('surnameHeader'),
        accessor: 'surnames',
        className: 'text-left',
      },
      {
        Header: t('nameHeader'),
        accessor: 'name',
        className: 'text-left',
      },
      {
        Header: t('emailHeader'),
        accessor: 'email',
        className: 'text-left',
      },
      {
        Header: t('profileHeader'),
        accessor: 'rol',
        className: 'text-left',
      },
      {
        Header: t('centerHeader'),
        accessor: 'center',
        className: 'text-left',
      },
      {
        Header: t('birthdayHeader'),
        accessor: 'birthdate',
        className: 'text-left',
      },
      {
        Header: ' ',
        accessor: 'actions',
        className: 'text-left',
      },
    ],
    [translations]
  );

  const usersForTable = React.useMemo(
    () =>
      _.map(users, (user, index) => ({
        ...user,
        avatar: <Avatar image={user.avatar} fullName={getUserFullName(user)} />,
        birthdate: <LocaleDate date={user.birthdate} />,
        actions: (
          <Box style={{ textAlign: 'right', width: '100%' }}>
            <ActionButton
              disabled={!editMode}
              onClick={() => {
                users.splice(index, 1);
                setUsers([...users]);
              }}
              tooltip={t('removeUser')}
              icon={<DeleteBinIcon />}
            />
          </Box>
        ),
      })),
    [users, editMode]
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
                  <Box sx={() => ({ maxWidth: 600 })}>
                    <SelectUserAgent
                      disabled={!editMode}
                      selectedUserAgents={_.map(users, 'value')}
                      returnItem
                      onChange={(e) => {
                        users.push(e);
                        setUsers([...users]);
                      }}
                      label={t('addUsers')}
                    />
                  </Box>
                  {usersForTable?.length ? (
                    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                      <Table columns={tableHeaders} data={usersForTable} />
                    </Box>
                  ) : null}
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
