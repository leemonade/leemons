import {
  Box,
  ContextContainer,
  Paragraph,
  Select,
  TableInput,
  Title,
  UserDisplayItem,
} from '@bubbles-ui/components';
import { unflatten } from '@common';
import SelectUserAgent from '@users/components/SelectUserAgent';
import _, { find, isArray, isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

const SelectAgents = ({ usersData, ...props }) => (
  <SelectUserAgent {...props} selectedUsers={_.map(usersData, 'user.id')} returnItem />
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

const PermissionsDataUsers = ({ roles, value, onChange, asset, t, translations }) => {
  // ··············································································
  // EFFECTS

  useEffect(() => {
    const { canAccess } = asset;
    if (isArray(canAccess)) {
      onChange(
        canAccess.map((user) => ({
          user,
          role: user.permissions[0],
          editable: user.permissions[0] !== 'owner',
        }))
      );
    }
  }, [asset]);

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
          node: <SelectAgents usersData={value} />,
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
        valueRender: (val) => find(roles, { val })?.label,
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
      <Box>
        <Title order={5}>{t('permissionsData.labels.addUsers')}</Title>
        <Paragraph>{t('permissionsData.labels.addUsersDescription')}</Paragraph>
      </Box>
      {!isEmpty(USERS_COLUMNS) && !isEmpty(USER_LABELS) && (
        <TableInput
          data={value}
          onChange={onChange}
          columns={USERS_COLUMNS}
          labels={USER_LABELS}
          showHeaders={false}
          forceShowInputs
          sortable={false}
          onBeforeAdd={checkIfUserIsAdded}
          resetOnAdd
          editable
          unique
        />
      )}
    </ContextContainer>
  );
};

PermissionsDataUsers.propTypes = {
  roles: PropTypes.any,
  asset: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
  t: PropTypes.func,
  translations: PropTypes.object,
};

export default PermissionsDataUsers;
export { PermissionsDataUsers };
