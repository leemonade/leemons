import {
  Box,
  ContextContainer,
  Paragraph,
  Select,
  TableInput,
  Title,
  UserDisplayItem,
} from '@bubbles-ui/components';
import SelectUserAgent from '@users/components/SelectUserAgent';
import _, { find, isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const SelectAgents = ({ usersData, ...props }) => (
  <SelectUserAgent
    {...props}
    onlyContacts={true}
    selectedUsers={_.map(usersData, 'user.id')}
    returnItem
  />
);

SelectAgents.propTypes = {
  usersData: PropTypes.array,
};

const RoleSelect = (props) => {
  if (!props.value) {
    props.onChange('viewer');
  }
  return <Select {...props} />;
};

// add prop types
RoleSelect.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};

const PermissionsDataUsers = ({ editMode, roles, value, onChange, alreadySelectedUsers, t }) => {
  // ··············································································
  // EFFECTS

  // ··············································································
  // HANDLERS

  const checkIfUserIsAdded = (userData) => {
    const found = find(value, (data) => data.user.id === userData.user.id);
    return isNil(found);
  };

  // ··············································································
  // LABELS & STATICS

  const USERS_COLUMNS = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'user',
        input: {
          node: <SelectAgents usersData={[...alreadySelectedUsers, ...value]} />,
          rules: { required: 'Required field' },
        },
        editable: false,
        valueRender: (val) => <UserDisplayItem {...val} variant="inline" size="xs" />,
        style: { width: '50%' },
      },
      {
        Header: 'Role',
        accessor: 'role',
        input: {
          node: <RoleSelect />,
          rules: { required: 'Required field' },
          data: roles,
        },
        valueRender: (val) => find(roles, { value: val })?.label,
      },
    ],
    [roles, value]
  );

  const USER_LABELS = useMemo(
    () => ({
      add: t('permissionsData.labels.addUserButton', 'Add'),
      remove: t('permissionsData.labels.removeUserButton', 'Remove'),
      edit: t('permissionsData.labels.editUserButton', 'Edit'),
      accept: t('permissionsData.labels.acceptButton', 'Accept'),
      cancel: t('permissionsData.labels.cancelButton', 'Cancel'),
    }),
    [t]
  );

  // ··············································································
  // RENDER

  return (
    <ContextContainer>
      {!editMode ? (
        <Box>
          <Title order={5}>{t('permissionsData.labels.addUsers')}</Title>
          <Paragraph>{t('permissionsData.labels.addUsersDescription')}</Paragraph>
        </Box>
      ) : (
        <Box>
          <Title order={5}>{t('permissionsData.labels.editAddUsers')}</Title>
        </Box>
      )}

      {!isEmpty(USERS_COLUMNS) && !isEmpty(USER_LABELS) && (
        <TableInput
          data={value}
          onChange={onChange}
          columns={USERS_COLUMNS}
          labels={USER_LABELS}
          showHeaders={!editMode}
          forceShowInputs={!editMode}
          sortable={false}
          editable={editMode}
          onBeforeAdd={checkIfUserIsAdded}
          resetOnAdd
          unique
        />
      )}
    </ContextContainer>
  );
};

PermissionsDataUsers.propTypes = {
  roles: PropTypes.any,
  userRole: PropTypes.string,
  asset: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
  t: PropTypes.func,
  translations: PropTypes.object,
  editMode: PropTypes.bool,
  alreadySelectedUsers: PropTypes.any,
};

export default PermissionsDataUsers;
export { PermissionsDataUsers };
