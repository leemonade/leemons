import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { Drawer, Button } from '@bubbles-ui/components';
import usePermissions from '@users/hooks/usePermissions';
import { UserDetail } from './UserDetail';
import { UserAdminDrawer } from './UserAdminDrawer';

function UserDetailDrawer({ userId, center, opened, onClose = noop, onSave = noop }) {
  const [canEdit, setCanEdit] = React.useState(false);
  const [openedAdminDrawer, setOpenedAdminDrawer] = React.useState(false);
  const [selfOpen, setSelfOpen] = React.useState(opened);
  const [user, setUser] = React.useState(null);

  const {
    data: permissions,
    isLoading: permissionsLoading,
    refetch: refetchPermissions,
  } = usePermissions({
    name: 'users.users',
    enabled: opened,
  });

  React.useEffect(() => {
    setSelfOpen(opened);
    if (opened) {
      refetchPermissions();
    }
  }, [opened]);

  // ························································
  // INIT DATA LOADING

  async function handlePermissions() {
    setCanEdit(
      permissions.actionNames.includes('create') || permissions.actionNames.includes('admin')
    );
  }

  React.useEffect(() => {
    if (!permissionsLoading && permissions) {
      handlePermissions();
    }
  }, [permissions, permissionsLoading]);

  // ····················································
  // HANDLERS

  function handleOnEdit() {
    setOpenedAdminDrawer(true);
    setSelfOpen(false);
  }

  function handleOnClose() {
    onClose();
  }

  function handleOnAdminClose(reload) {
    setOpenedAdminDrawer(false);
    onClose(reload);
  }

  function handleOnLoadUser(data) {
    setUser(data);
  }

  return (
    <>
      <Drawer opened={selfOpen} onClose={handleOnClose}>
        <Drawer.Header title="Detalle de usuario" />
        <Drawer.Content>
          <UserDetail userId={userId} center={center} onLoadUser={handleOnLoadUser} />
        </Drawer.Content>
        {canEdit && (
          <Drawer.Footer>
            <Drawer.Footer.RightActions>
              <Button onClick={handleOnEdit}>Editar</Button>
            </Drawer.Footer.RightActions>
          </Drawer.Footer>
        )}
      </Drawer>
      <UserAdminDrawer
        user={user}
        center={center}
        opened={openedAdminDrawer}
        onClose={handleOnAdminClose}
        onSave={onSave}
      />
    </>
  );
}

UserDetailDrawer.propTypes = {
  center: PropTypes.object,
  userId: PropTypes.string,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

export { UserDetailDrawer };
export default UserDetailDrawer;
