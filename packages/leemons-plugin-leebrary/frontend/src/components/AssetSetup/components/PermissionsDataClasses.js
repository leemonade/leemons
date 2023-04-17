import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import usePrograms from '@academic-portfolio/hooks/usePrograms';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import {
  Box,
  ContextContainer,
  ImageLoader,
  Paragraph,
  Select,
  TableInput,
  Text,
  Title,
} from '@bubbles-ui/components';
import _, { find, isArray, isEmpty, isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

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
        <Text>{`${klass.subject.name}${
          klass?.groups?.name ? ` - ${klass.groups.name}` : ''
        }`}</Text>
      </Box>
    </Box>
  );
}

const PermissionsDataClasses = ({
  roles,
  value,
  onChange,
  asset,
  profileSysName,
  t,
  translations,
}) => {
  const [selectedProgram, setSelectedProgram] = useState(null);

  const { data: classes } = useSessionClasses();
  const { data: programs } = usePrograms();

  const programsData = useMemo(() => {
    let goodPrograms = programs;
    if (asset?.program) {
      goodPrograms = _.filter(programs, { id: asset.program });
    }
    return (
      goodPrograms?.map((program) => ({
        value: program.id,
        label: program.name,
      })) ?? []
    );
  }, [programs, asset?.program]);

  const classesData = useMemo(() => {
    let goodClasses = classes;
    if (selectedProgram) {
      goodClasses = _.filter(goodClasses, { program: selectedProgram });
    }
    if (asset?.subjects?.length) {
      const subjectsIds = _.map(asset.subjects, 'subject');
      goodClasses = _.filter(goodClasses, ({ subject }) => subjectsIds.includes(subject.id));
    }
    return (
      goodClasses?.map((klass) => ({
        value: klass.id,
        label: klass.groups.isAlone
          ? klass.subject.name
          : `${klass.subject.name} - ${klass.groups.name}`,
        ...klass,
      })) ?? []
    );
  }, [classes, selectedProgram, asset?.subjects]);

  // ··············································································
  // EFFECTS

  useEffect(() => {
    const { classesCanAccess } = asset;

    if (isArray(classesCanAccess) && classesCanAccess.length) {
      const classe = find(classes, { id: classesCanAccess[0].class });
      if (classe) {
        setSelectedProgram(classe.program);
      }
      onChange(
        classesCanAccess.map((klass) => ({
          class: [klass.class],
          role: klass.role,
        }))
      );
    }
  }, [asset, classes]);

  // ··············································································
  // HANDLERS

  const checkIfClassIsAdded = (newClass) => {
    const found = find(value, (selectedClass) => selectedClass.class[0] === newClass.class[0]);
    return isNil(found);
  };

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

  const CLASSES_COLUMNS = useMemo(
    () => [
      {
        Header: 'Class',
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
          rules: { required: 'Required field' },
        },
        editable: false,
        valueRender: (values) =>
          values.map((value) => (
            <ClassItem
              key={value}
              class={classesData.find((klass) => klass.id === value)}
              variant="inline"
              size="xs"
            />
          )),
      },
      {
        Header: 'Role',
        accessor: 'role',
        input: {
          node: <Select />,
          rules: { required: 'Required field' },
          data: roles?.filter((role) => ['viewer', 'editor'].includes(role.value)),
        },
        valueRender: (value) => find(roles, { value })?.label,
      },
    ],
    [roles, classesData]
  );

  // ··············································································
  // RENDER

  return (
    <ContextContainer>
      {profileSysName === 'teacher' ? (
        <Box>
          <Select
            label={t('permissionsData.labels.programs')}
            value={selectedProgram}
            onChange={(e) => {
              onChange([]);
              setSelectedProgram(e);
            }}
            data={programsData}
          />
        </Box>
      ) : null}

      <Box>
        <Title order={5}>{t('permissionsData.labels.addClasses')}</Title>
        <Paragraph>{t('permissionsData.labels.addClassesDescription')}</Paragraph>
      </Box>
      {!isEmpty(CLASSES_COLUMNS) && !isEmpty(USER_LABELS) && (
        <TableInput
          data={value}
          onChange={onChange}
          columns={CLASSES_COLUMNS}
          labels={USER_LABELS}
          disabled={profileSysName === 'student' ? false : !selectedProgram}
          showHeaders={false}
          forceShowInputs
          sortable={false}
          onBeforeAdd={checkIfClassIsAdded}
          resetOnAdd
          editable
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
};

export default PermissionsDataClasses;
export { PermissionsDataClasses };
