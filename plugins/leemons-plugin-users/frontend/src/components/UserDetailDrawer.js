import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { Drawer, Button } from '@bubbles-ui/components';
import usePermissions from '@users/hooks/usePermissions';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { getCookieToken, getSessionCenter } from '@users/session';
import { EnrollUserSummary } from '@academic-portfolio/components/EnrollUserSummary';
import { UserDetail, USER_DETAIL_VIEWS } from './UserDetail';
import { UserAdminDrawer } from './UserAdminDrawer';

function UserDetailDrawer({
  userId,
  center: centerProp,
  opened,
  sysProfileFilter,
  viewMode = USER_DETAIL_VIEWS.ADMIN,
  onClose = noop,
  onSave = noop,
}) {
  const [canEdit, setCanEdit] = React.useState(false);
  const [openedAdminDrawer, setOpenedAdminDrawer] = React.useState(false);
  const [selfOpen, setSelfOpen] = React.useState(opened);
  const [user, setUser] = React.useState(null);
  const [t] = useTranslateLoader(prefixPN('user_detail'));
  const center = centerProp ?? getSessionCenter();
  const token = getCookieToken(true);
  const { userAgentId } = token.centers[0];
  const [isChatOpen, setIsChatOpen] = React.useState(false);

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

  // ·······················································
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
  // METHODS

  function getTitle() {
    if (sysProfileFilter) {
      return t(`title.${sysProfileFilter}`);
    }

    return t('title.default');
  }

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

  // ····················································
  // RENDER

  const contactUserAgentId = React.useMemo(() => {
    // If the view mode is STUDENT, we assume that the user is a student and is a contact of the userId
    if (viewMode === USER_DETAIL_VIEWS.STUDENT) {
      return userAgentId;
    }

    return null;
  }, [userAgentId, viewMode]);

  return (
    <>
      <Drawer opened={selfOpen} onClose={handleOnClose}>
        <Drawer.Header title={getTitle()} />
        <Drawer.Content>
          <UserDetail
            userId={userId}
            center={center}
            sysProfileFilter={sysProfileFilter}
            onLoadUser={handleOnLoadUser}
            viewMode={viewMode}
          />
          <EnrollUserSummary
            userId={userId}
            center={center}
            contactUserAgentId={contactUserAgentId}
            sysProfileFilter={sysProfileFilter}
            viewMode={viewMode}
          />
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
  sysProfileFilter: PropTypes.string,
  viewMode: PropTypes.oneOf(Object.values(USER_DETAIL_VIEWS)),
};

export { UserDetailDrawer };
export default UserDetailDrawer;
