import {
  Box,
  ContextContainer,
  Paragraph,
  Select,
  TableInput,
  Title,
} from '@bubbles-ui/components';
import { SelectCenter } from '@users/components';
import { find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

const PermissionsDataAdminCenterPrograms = ({
  roles,
  value,
  onChange,
  asset,
  profileSysName,
  t,
  translations,
}) => {
  // ··············································································
  // LABELS & STATICS

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

  const COLUMNS = useMemo(
    () => [
      {
        Header: t('shareCenters'),
        accessor: 'centers',
        input: {
          node: <SelectCenter multiple />,
          rules: { required: 'Required field' },
        },
        editable: false,
        valueRender: (values) => {
          console.log(values);
          return values;
        },
      },
      {
        Header: t('sharePermissions'),
        accessor: 'role',
        input: {
          node: <Select />,
          rules: { required: 'Required field' },
          data: roles?.filter((role) => ['viewer', 'editor'].includes(role.value)),
        },
        valueRender: (val) => find(roles, { val })?.label,
      },
    ],
    [roles]
  );

  // ··············································································
  // RENDER

  return (
    <ContextContainer>
      <Box>
        <Title order={5}>{t('permissionsData.labels.addClasses')}</Title>
        <Paragraph>{t('permissionsData.labels.addClassesDescription')}</Paragraph>
      </Box>
      {!isEmpty(COLUMNS) && !isEmpty(USER_LABELS) && (
        <TableInput
          data={value}
          onChange={onChange}
          columns={COLUMNS}
          labels={USER_LABELS}
          showHeaders={false}
          forceShowInputs
          sortable={false}
          resetOnAdd
          editable
          unique
        />
      )}
    </ContextContainer>
  );
};

PermissionsDataAdminCenterPrograms.propTypes = {
  roles: PropTypes.any,
  asset: PropTypes.object,
  t: PropTypes.func,
  translations: PropTypes.object,
  profileSysName: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default PermissionsDataAdminCenterPrograms;
export { PermissionsDataAdminCenterPrograms };
