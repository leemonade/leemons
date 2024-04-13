import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { Drawer, Button } from '@bubbles-ui/components';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import { UserDetail } from './UserDetail';
import { UserAdminDrawer } from './UserAdminDrawer';

function UserDetailDrawer({ userId, centerId, opened, onClose = noop, onSave = noop }) {
  const [canEdit, setCanEdit] = React.useState(false);
  const [openedAdminDrawer, setOpenedAdminDrawer] = React.useState(false);
  const [selfOpen, setSelfOpen] = React.useState(opened);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    setSelfOpen(opened);
  }, [opened]);

  // ························································
  // INIT DATA LOADING

  async function getPermissions() {
    const { permissions } = await getPermissionsWithActionsIfIHaveRequest('users.users');
    if (permissions) {
      setCanEdit(
        permissions.actionNames.includes('create') || permissions.actionNames.includes('admin')
      );
    }
  }

  React.useEffect(() => {
    getPermissions();
  }, []);

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
          <UserDetail userId={userId} centerId={centerId} onLoadUser={handleOnLoadUser} />
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
        centerId={centerId}
        opened={openedAdminDrawer}
        onClose={handleOnAdminClose}
        onSave={onSave}
      />
    </>
  );
}

UserDetailDrawer.propTypes = {
  centerId: PropTypes.string,
  userId: PropTypes.string,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

export { UserDetailDrawer };
export default UserDetailDrawer;
