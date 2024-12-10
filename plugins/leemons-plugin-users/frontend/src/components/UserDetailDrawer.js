import React from 'react';

import { EnrollUserSummary } from '@academic-portfolio/components/EnrollUserSummary';
import { Drawer, Button } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { noop } from 'lodash';
import PropTypes from 'prop-types';

import { UserAdminDrawer } from './UserAdminDrawer';
import { UserDatasetSummary } from './UserDataset/UserDatasetSummary';
import { UserDetail, USER_DETAIL_VIEWS } from './UserDetail';

import prefixPN from '@users/helpers/prefixPN';
import usePermissions from '@users/hooks/usePermissions';
import { getSessionCenter, getSessionUserAgent } from '@users/session';

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
  const [userAgents, setUserAgents] = React.useState([]);
  const [t] = useTranslateLoader(prefixPN('user_detail'));
  const center = centerProp ?? getSessionCenter();
  const userAgentId = getSessionUserAgent();

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

  function handleOnLoadUserAgents(data) {
    setUserAgents(data);
  }

  // ····················································
  // RENDER

  const contactUserAgentId = React.useMemo(() => {
    // If view mode is STUDENT, assume the student is either a contact of the user itself
    if (viewMode === USER_DETAIL_VIEWS.STUDENT) {
      return userAgentId;
    }

    return null;
  }, [userAgentId, viewMode]);

  const canEditDataset = React.useMemo(() => {
    // Allow edit dataset if the user is a student and is viewing its own dataset
    // Or if the user is a teacher and is viewing its own dataset or the dataset of a student
    if (
      viewMode === USER_DETAIL_VIEWS.STUDENT ||
      (viewMode === USER_DETAIL_VIEWS.TEACHER && sysProfileFilter === 'teacher')
    ) {
      return userAgents.some((userAgent) => userAgent.id === userAgentId);
    }

    return true;
  }, [viewMode, userAgents, userAgentId, sysProfileFilter]);

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
            onLoadUserAgents={handleOnLoadUserAgents}
            viewMode={viewMode}
            onChat={handleOnClose}
          />
          <EnrollUserSummary
            userId={userId}
            center={center}
            contactUserAgentId={contactUserAgentId}
            sysProfileFilter={sysProfileFilter}
            viewMode={viewMode}
          />
          <UserDatasetSummary
            userId={userId}
            userAgentIds={userAgents.map((userAgent) => userAgent.id)}
            canHandleEdit={canEditDataset}
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
