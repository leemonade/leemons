import { SelectProgram } from '@academic-portfolio/components';
import {
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
import { SelectProfile } from '@users/components';
import _, { find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

function ProgramSelect(props) {
  const center = props.center || props.form.getValues(props.name.replace('program', 'center'));
  return <SelectProgram {...props} ensureIntegrity autoSelectOneOption={false} center={center} />;
}

const PermissionsDataPrograms = ({
  roles,
  value: _value,
  onChange,
  profiles,
  centers,
  t,
  editMode = false,
}) => {
  const [store, render] = useStore();

  let value = [];
  if (editMode) {
    const centerIds = _.map(centers, 'id');
    value = _.filter(_value, (val) => centerIds.includes(val.center) && !!val.program);
  } else {
    value = _value;
  }

  function preOnChange(e, { type }) {
    let vals = _.map(e, (v) => ({ ...v, center: v.center || centers[0].id }));
    if (editMode && ['remove', 'edit'].includes(type)) {
      const stringifyValue = _.map(value, (v) => JSON.stringify(v));
      const stringifyVals = _.map(vals, (v) => JSON.stringify(v));
      const [item] = _.difference(stringifyValue, stringifyVals);
      const [newItem] = _.difference(stringifyVals, stringifyValue);
      if (item) {
        const sValues = _.map(_value, (v) => JSON.stringify(v));
        const index = sValues.indexOf(item);
        if (index >= 0) {
          if (type === 'remove') {
            sValues.splice(index, 1);
          } else {
            sValues[index] = newItem;
          }
          vals = _.map(sValues, (v) => JSON.parse(v));
        }
      }
    }
    onChange(vals);
  }

  React.useEffect(() => {
    if (editMode) {
      store.canAddProfiles = false;
      _.forEach(value, (val) => {
        if (val.profile) store.canAddProfiles = true;
      });
      render();
    }
  }, [editMode, JSON.stringify(value)]);

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
      Header: t('permissionsData.labels.sharePrograms'),
      accessor: 'program',
      input: {
        node: <ProgramSelect center={centers[0]?.id} />,
      },
      editable: false,
      valueRender: (values, formValues) => (
        <ProgramSelect readOnly value={values} center={formValues.center || centers[0].id} />
      ),
    });

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
  }, [roles, centers, store.canAddProfiles]);

  if (editMode && !value?.length) return null;

  return (
    <ContextContainer spacing={editMode ? 0 : 5}>
      {!editMode ? (
        <>
          <Box>
            <Title order={5}>{t('permissionsData.labels.addPrograms')}</Title>
            <Paragraph>{t('permissionsData.labels.addProgramsDescription')}</Paragraph>
          </Box>

          {profiles?.length ? (
            <Stack>
              <Switch
                onChange={() => {
                  store.canAddProfiles = !store.canAddProfiles;
                  render();
                }}
                checked={store.canAddProfiles}
                label={t('permissionsData.labels.profilesPerProgram')}
              />
            </Stack>
          ) : null}
        </>
      ) : (
        <Title order={5}>{t('permissionsData.labels.addProgramsEdit')}</Title>
      )}
      {!isEmpty(COLUMNS) && !isEmpty(USER_LABELS) && (
        <TableInput
          data={value}
          onChange={preOnChange}
          columns={COLUMNS}
          labels={USER_LABELS}
          showHeaders={!editMode}
          forceShowInputs={!editMode}
          sortable={false}
          editable={editMode}
          unique
        />
      )}
    </ContextContainer>
  );
};

PermissionsDataPrograms.propTypes = {
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

export default PermissionsDataPrograms;
export { PermissionsDataPrograms };
