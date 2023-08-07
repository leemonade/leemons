import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { useSessionClasses } from '@academic-portfolio/hooks';
import {
  Box,
  ContextContainer,
  ImageLoader,
  Paragraph,
  Select,
  Stack,
  Switch,
  TableInput,
  Text,
  Title,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import { SelectProfile } from '@users/components';
import _, { find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

function ClassItem({ class: klass, ...props }) {
  if (!klass) {
    return null;
  }

  return (
    <Box {...props}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing[2],
          alignItems: 'center',
        })}
      >
        <Box
          sx={() => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 26,
            minHeight: 26,
            maxWidth: 26,
            maxHeight: 26,
            borderRadius: '50%',
            backgroundColor: klass?.color,
          })}
        >
          <ImageLoader
            sx={() => ({
              borderRadius: 0,
              filter: 'brightness(0) invert(1)',
            })}
            forceImage
            width={16}
            height={16}
            src={getClassIcon(klass)}
          />
        </Box>
        <Text>{`${klass.subject.name}${klass?.groups?.name ? ` - ${klass.groups.name}` : ''
          }`}</Text>
      </Box>
    </Box>
  );
}

const PermissionsDataClasses = ({
  roles,
  value: _value,
  onChange,
  profiles,
  centers,
  t,
  editMode = false,
}) => {
  const [store, render] = useStore();

  const { data: classes } = useSessionClasses();

  let value = [];
  if (editMode) {
    const centerIds = _.map(centers, 'id');
    value = _.filter(_value, (val) => centerIds.includes(val.center) && !!val.class);
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

  const classesData = useMemo(
    () =>
      classes?.map((klass) => ({
        value: klass.id,
        label: klass.groups.isAlone
          ? klass.subject.name
          : `${klass.subject.name} - ${klass.groups.name}`,
        ...klass,
      })) ?? [],
    [classes]
  );

  const COLUMNS = useMemo(() => {
    const result = [];

    result.push({
      Header: t('permissionsData.labels.shareClasses'),
      accessor: 'class',
      input: {
        node: (
          <Select
            itemComponent={(item) => (
              <ClassItem {...item} class={classesData.find((klass) => klass.id === item.value)} />
            )}
            valueComponent={(item) => (
              <ClassItem {...item} class={classesData.find((klass) => klass.id === item.value)} />
            )}
            data={classesData}
          />
        ),
      },
      editable: false,
      valueRender: (val) => {
        const v = _.isString(val) ? val : val[0];
        return (
          <ClassItem
            key={v}
            class={classesData.find((klass) => klass.id === v)}
            variant="inline"
            size="xs"
          />
        );
      },
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
            <Title order={5}>{t('permissionsData.labels.addClasses')}</Title>
            <Paragraph>{t('permissionsData.labels.addClassesDescription')}</Paragraph>
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
        <Title order={5}>{t('permissionsData.labels.addClasses')}</Title>
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

PermissionsDataClasses.propTypes = {
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

export default PermissionsDataClasses;
export { PermissionsDataClasses };
