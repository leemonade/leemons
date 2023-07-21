import { SelectProgram } from '@academic-portfolio/components';
import {
  Alert,
  Box,
  ContextContainer,
  Paragraph,
  Select,
  Stack,
  Switch,
  TableInput,
  Title,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import { SelectCenter, SelectProfile } from '@users/components';
import _, { find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

function ProgramSelect(props) {
  const center = props.center || props.form.getValues(props.name.replace('program', 'center'));
  return <SelectProgram {...props} ensureIntegrity autoSelectOneOption={false} center={center} />;
}

const PermissionsDataCenterProgramsProfiles = ({
  roles,
  value,
  onChange,
  profiles,
  centers,
  asset,
  profileSysName,
  t,
  translations,
  editMode = false,
}) => {
  const [store, render] = useStore();

  function haveEqualsToPublic() {
    const item = _.find(
      value,
      (val) => val.center === '*' && !val.program && !val.profile && val.role === 'viewer'
    );

    return !!item;
  }

  function isEqualsToAllEdit(val) {
    return val.center === '*' && !val.program && !val.profile && val.role === 'editor';
  }

  function checkIfCanBeAdded(val) {
    if (isEqualsToAllEdit(val)) {
      addErrorAlert(t('permissionsData.labels.addCenterEditAll'));
      return false;
    }
    return true;
  }

  React.useEffect(() => {
    if (editMode) {
      store.canAddPrograms = false;
      store.canAddProfiles = false;
      _.forEach(value, (val) => {
        if (val.program) store.canAddPrograms = true;
        if (val.profile) store.canAddProfiles = true;
      });
      render();
    }
  }, [editMode, value]);

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

  const COLUMNS = useMemo(() => {
    const result = [];
    result.push({
      Header: t('permissionsData.labels.shareCenters'),
      accessor: 'center',
      input: {
        node: (
          <SelectCenter
            additionalData={[{ label: t('permissionsData.labels.allCenters'), value: '*' }]}
          />
        ),
        rules: { required: 'Required field' },
      },
      editable: false,
      valueRender: (values) => {
        if (values === '*') return t('permissionsData.labels.allCenters');
        const center = _.find(centers, { id: values });
        return center?.name;
      },
    });

    if (store.canAddPrograms) {
      result.push({
        Header: t('permissionsData.labels.sharePrograms'),
        accessor: 'program',
        input: {
          node: <ProgramSelect />,
        },
        editable: false,
        valueRender: (values, formValues) => (
          <ProgramSelect readOnly value={values} center={formValues.center} />
        ),
      });
    }

    if (store.canAddProfiles) {
      result.push({
        Header: t('permissionsData.labels.shareProfiles'),
        accessor: 'profile',
        input: {
          node: <SelectProfile />,
        },
        editable: false,
        valueRender: (values) => <SelectProfile readOnly value={values} />,
      });
    }

    result.push({
      Header: t('permissionsData.labels.sharePermissions'),
      accessor: 'role',
      input: {
        node: <Select />,
        rules: { required: 'Required field' },
        data: roles?.filter((role) => ['viewer', 'editor', 'assigner'].includes(role.value)),
      },
      valueRender: (val) => find(roles, { value: val })?.label,
    });

    return result;
  }, [roles, store.canAddProfiles, store.canAddPrograms]);

  return (
    <ContextContainer spacing={editMode ? 0 : 5}>
      {!editMode ? (
        <>
          <Box>
            <Title order={5}>{t('permissionsData.labels.addCenters')}</Title>
            <Paragraph>{t('permissionsData.labels.addCentersDescription')}</Paragraph>
          </Box>
          <Stack>
            {profiles?.length ? (
              <Switch
                onChange={() => {
                  store.canAddProfiles = !store.canAddProfiles;
                  render();
                }}
                checked={store.canAddProfiles}
                label={t('permissionsData.labels.profilesPerCenter')}
              />
            ) : null}

            <Switch
              onChange={() => {
                store.canAddPrograms = !store.canAddPrograms;
                render();
              }}
              checked={store.canAddPrograms}
              label={t('permissionsData.labels.programsPerCenter')}
            />
          </Stack>
        </>
      ) : (
        <Title order={5}>{t('permissionsData.labels.addCentersEdit')}</Title>
      )}
      {!isEmpty(COLUMNS) && !isEmpty(USER_LABELS) && (
        <TableInput
          data={value}
          onChange={onChange}
          columns={COLUMNS}
          labels={USER_LABELS}
          showHeaders={!editMode}
          forceShowInputs={!editMode}
          sortable={false}
          editable={editMode}
          onBeforeAdd={checkIfCanBeAdded}
          unique
        />
      )}
      {haveEqualsToPublic() ? (
        <Alert severity="warning" closeable={false}>
          {t('permissionsData.labels.addCenterAsPublic')}
        </Alert>
      ) : null}
    </ContextContainer>
  );
};

PermissionsDataCenterProgramsProfiles.propTypes = {
  roles: PropTypes.any,
  asset: PropTypes.object,
  t: PropTypes.func,
  translations: PropTypes.object,
  profileSysName: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  profiles: PropTypes.array,
  centers: PropTypes.array,
  editMode: PropTypes.bool,
};

export default PermissionsDataCenterProgramsProfiles;
export { PermissionsDataCenterProgramsProfiles };
