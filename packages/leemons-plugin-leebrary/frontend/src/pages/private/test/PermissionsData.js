import React, { useState, useMemo, useEffect } from 'react';
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
  Title,
  Paragraph,
  Switch,
  UserDisplayItem,
} from '@bubbles-ui/components';
import { LibraryItem } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import SelectUserAgent from '@users/components/SelectUserAgent';
import prefixPN from '../../../helpers/prefixPN';

const ROLES = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
];

const ASSET = {
  id: '620bbb607129df59430f3329',
  color: '#DC5571',
  name: 'The Roman Empire',
  fileType: 'video',
  description:
    'We’ve always been told that the brain contains billions of neurons, which, of course, have an essential role in all the processes we do. But what is the role of the neurons in the brain?',
  metadata: [
    { label: 'Quality', value: '128kb' },
    { label: 'Format', value: 'mp3' },
    { label: 'Duration', value: '10 min' },
    { label: 'Transcript', value: 'Not available' },
  ],
  tags: ['Rome', 'Docu'],
  cover:
    'https://images.unsplash.com/photo-1627552245715-77d79bbf6fe2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  public: false,
};

const PermissionsData = ({ sharing }) => {
  const asset = ASSET;

  const [t] = useTranslateLoader(prefixPN('assetSetup'));
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [roles, setRoles] = useState(ROLES);
  const [isPublic, setIsPublic] = useState(asset?.public);

  useEffect(() => console.log(usersData), [usersData]);

  useEffect(() => {
    if (asset?.public !== isPublic) {
      setIsPublic(asset?.public);
    }
  }, [asset]);

  const USERS_COLUMNS = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'user',
        input: {
          node: <SelectUserAgent returnItem />,
          rules: { required: 'Required field' },
        },
        editable: false,
        valueRender: (value) => <UserDisplayItem {...value} variant="inline" size="xs" />,
        style: { width: '65%' },
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
    <Box style={{ width: 600, margin: 50 }}>
      <Paper fullWidth>
        {!isEmpty(asset) && (
          <ContextContainer
            title={
              sharing ? t('permissionsData.header.shareTitle') : t('permissionsData.labels.title')
            }
          >
            <Paper bordered padding={1} shadow="none">
              <LibraryItem asset={asset} />
            </Paper>
            <ContextContainer divided>
              <Box>
                <Switch
                  checked={isPublic}
                  onChange={setIsPublic}
                  label={t('permissionsData.labels.isPublic')}
                />
              </Box>
              {!isPublic && (
                <ContextContainer>
                  <Box>
                    <Title order={5}>{t('permissionsData.labels.addUsers')}</Title>
                    <Paragraph>{t('permissionsData.labels.addUsersDescription')}</Paragraph>
                  </Box>
                  {!isEmpty(USERS_COLUMNS) && !isEmpty(USER_LABELS) && (
                    <TableInput
                      data={usersData}
                      onChange={setUsersData}
                      columns={USERS_COLUMNS}
                      labels={USER_LABELS}
                      showHeaders={false}
                      sortable={false}
                      resetOnAdd
                      editable
                    />
                  )}
                </ContextContainer>
              )}
              <Stack justifyContent={'end'} fullWidth>
                <Button loading={loading}>
                  {sharing
                    ? t('permissionsData.labels.shareButton')
                    : t('permissionsData.labels.saveButton')}
                </Button>
              </Stack>
            </ContextContainer>
          </ContextContainer>
        )}
      </Paper>
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
