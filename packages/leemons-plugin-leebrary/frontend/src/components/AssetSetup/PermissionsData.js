import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { find, isEmpty } from 'lodash';
import {
  Box,
  Paper,
  ContextContainer,
  Button,
  TableInput,
  Stack,
  TextInput,
  Select,
} from '@bubbles-ui/components';
import { LibraryItem } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '../../helpers/prefixPN';

const ROLES = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
];

const PermissionsData = ({ asset, sharing }) => {
  const [t] = useTranslateLoader(prefixPN('assetSetup'));
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [roles, setRoles] = useState(ROLES);

  const USERS_COLUMNS = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'user',
        input: {
          node: <TextInput />,
          rules: { required: 'Required field' },
        },
        editable: false,
      },
      {
        Header: 'Role',
        accessor: 'role',
        input: {
          node: <Select />,
          rules: { required: 'Required field' },
          data: roles,
        },
        valueRender: (value) => find(roles, { value })?.label,
      },
    ],
    [roles]
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

  return (
    <Box>
      <ContextContainer
        title={sharing ? t('permissionsData.header.shareTitle') : t('permissionsData.labels.title')}
      >
        <Paper bordered padding={1} shadow="none">
          <LibraryItem asset={asset} />
        </Paper>
        <ContextContainer divided>
          <ContextContainer
            subtitle={t('permissionsData.labels.addUsers')}
            description={t('permissionsData.labels.addUsersDescription')}
          >
            {!isEmpty(USERS_COLUMNS) && !isEmpty(USER_LABELS) && (
              <TableInput
                data={usersData}
                onChange={setUsersData}
                columns={USERS_COLUMNS}
                labels={USER_LABELS}
                showHeaders={false}
              />
            )}
          </ContextContainer>
          <Stack justifyContent={'end'} fullWidth>
            <Button loading={loading}>
              {sharing
                ? t('permissionsData.labels.shareButton')
                : t('permissionsData.labels.saveButton')}
            </Button>
          </Stack>
        </ContextContainer>
      </ContextContainer>
    </Box>
  );
};

PermissionsData.propTypes = {
  asset: PropTypes.object,
  loading: PropTypes.bool,
  sharing: PropTypes.bool,
};

export default PermissionsData;
export { PermissionsData };
