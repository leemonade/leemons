import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { find, isArray, isEmpty, isNil } from 'lodash';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  ContextContainer,
  Button,
  TableInput,
  Stack,
  Alert,
  Select,
  Title,
  Paragraph,
  Switch,
  UserDisplayItem,
} from '@bubbles-ui/components';
import { LibraryItem } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import SelectUserAgent from '@users/components/SelectUserAgent';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { unflatten, useRequestErrorMessage } from '@common';
import prefixPN from '../../../helpers/prefixPN';
import { prepareAsset } from '../../../helpers/prepareAsset';
import { getAssetRequest, setPermissionsRequest } from '../../../request';

const ROLES = [
  { label: 'Ownerr', value: 'owner' },
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
  { label: 'Commentor', value: 'commentor' },
];

const PermissionsData = ({ sharing }) => {
  const [asset, setAsset] = useState(null);

  const [t, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isPublic, setIsPublic] = useState(asset?.public);
  const params = useParams();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  // ··············································································
  // DATA PROCESS

  const loadAsset = async (id) => {
    const results = await getAssetRequest(id);
    if (results.asset && results.asset.id !== asset?.id) {
      setAsset(prepareAsset(results.asset));
      const { canAccess } = results.asset;
      if (isArray(canAccess)) {
        setUsersData(
          canAccess.map((user) => ({
            user,
            role: user.permissions[0],
            editable: user.permissions[0] !== 'owner',
          }))
        );
      }
    }
  };

  const savePermissions = async () => {
    try {
      setLoading(true);
      const canAccess = usersData
        .filter((item) => item.editable !== false)
        .map((userData) => ({
          userAgent: userData.user.value || userData.user.userAgentIds[0],
          role: userData.role,
        }));

      await setPermissionsRequest(asset.id, { canAccess });
      setLoading(false);
      addSuccessAlert(
        sharing
          ? t(`permissionsData.labels.shareSuccess`)
          : t(`permissionsData.labels.permissionsSuccess`)
      );
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadAsset(params.asset);
  }, [params]);

  useEffect(() => {
    if (asset?.public !== isPublic) {
      setIsPublic(asset?.public);
    }
  }, [asset]);

  useEffect(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const { roleLabels } = items.plugins.leebrary.assetSetup;
      ROLES.forEach((rol, index) => {
        ROLES[index].label = roleLabels[rol.value] || ROLES[index].label;
      });
      setRoles(ROLES);
    }
  }, [translations]);

  // ··············································································
  // HANDLERS

  const handleOnClick = () => {
    savePermissions();
  };

  const checkIfUserIsAdded = (userData) => {
    const found = find(usersData, (data) => data.user.id === userData.user.id);
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
          node: <SelectUserAgent returnItem />,
          rules: { required: 'Required field' },
        },
        editable: false,
        valueRender: (value) => <UserDisplayItem {...value} variant="inline" size="xs" />,
        style: { width: '50%' },
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

  // ··············································································
  // RENDER

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
            {isArray(asset?.canAccess) ? (
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
                        forceShowInputs
                        sortable={false}
                        onBeforeAdd={checkIfUserIsAdded}
                        resetOnAdd
                        editable
                        unique
                      />
                    )}
                  </ContextContainer>
                )}
                <Stack justifyContent={'end'} fullWidth>
                  <Button loading={loading} onClick={handleOnClick}>
                    {sharing
                      ? t('permissionsData.labels.shareButton')
                      : t('permissionsData.labels.saveButton')}
                  </Button>
                </Stack>
              </ContextContainer>
            ) : (
              <Alert severity="error" closeable={false}>
                {t('permissionsData.errorMessages.share')}
              </Alert>
            )}
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
