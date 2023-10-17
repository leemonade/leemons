import { Drawer } from '@bubbles-ui/components';
import DetailUser from '@users/pages/private/users/DetailUser';
import PropTypes from 'prop-types';
import React from 'react';

function UserDetailDrawer({
  userId,
  profileId,
  centerId,
  opened,
  onClose = () => {},
  onChange = () => {},
}) {
  return (
    <Drawer size={720} opened={opened} onClose={onClose}>
      <DetailUser
        userId={userId}
        profileId={profileId}
        centerId={centerId}
        isDrawer
        onActive={onChange}
        onDisabled={onChange}
      />
    </Drawer>
  );
}

UserDetailDrawer.propTypes = {
  centerId: PropTypes.string,
  profileId: PropTypes.string,
  userId: PropTypes.string,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
};

export { UserDetailDrawer };
export default UserDetailDrawer;
