import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  Select,
  TableInput,
  ContextContainer,
  TextInput,
  Stack,
  InputWrapper,
  Button,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';

const ReferenceGroupsClassroomsSetup = ({
  onChange,
  value,
  formLabels,
  groups,
  selectedCourses,
  isMultiCourse,
  refGroupdisabled,
  usedGroups = [],
}) => {
  const [classroomsData, setClassroomsData] = useState([]);
  const form = useForm();

  useEffect(() => {
    if (value?.length) {
      form.reset();

      setClassroomsData(cloneDeep(value));
    } else {
      setClassroomsData([]);
    }
  }, [value]);

  const tableInputColumns = React.useMemo(
    () => [
      {
        Header: formLabels?.referenceGroup,
        accessor: 'referenceGroup',
        style: { width: 196 },
        valueRender: (val) => val?.split('::')[0],
        editable: false,
      },
      {
        Header: formLabels?.classroomId,
        accessor: 'classroomId',
        style: { width: 240 },
      },
    ],
    [formLabels]
  );

  const groupsSelectData = useMemo(() => {
    if (groups?.length && selectedCourses?.length) {
      if (isMultiCourse) {
        return groups
          .map((item) => ({
            label: item.name,
            value: `${item.name}::${item.id}`,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
      }
      return groups
        .filter((group) =>
          selectedCourses.some((course) => course.index === group?.metadata?.course)
        )
        .map((item) => ({ label: item.name, value: `${item.name}::${item.id}` }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
    return [];
  }, [groups, selectedCourses]);

  useEffect(() => {
    if (groupsSelectData?.length) {
      form.setValue('referenceGroup', groupsSelectData[0].value);
    }
  }, [groupsSelectData]);

  // Reset the classrooms to create when no multi-courses subjects change the selected course
  useEffect(() => {
    if (!isMultiCourse) {
      const courseIds = selectedCourses.map((course) => course.id);
      const classroomsNotMatchingCourses = classroomsData.some(
        (classroom) => !courseIds.includes(classroom.course)
      );
      if (classroomsNotMatchingCourses) {
        onChange([]);
      }
    } else {
      const updatedValue = [];
      value?.forEach((c) => {
        updatedValue.push({ ...c, course: cloneDeep(selectedCourses) });
      });
      onChange([...updatedValue]);
    }
  }, [selectedCourses]);

  const handleOnAdd = async () => {
    const validForm = await form.trigger();
    if (validForm) {
      const newItem = form.getValues();
      newItem.course = [...selectedCourses];

      // Check if the referenceGroup is already used
      const isReferenceGroupUsed = classroomsData.some(
        (item) => item.referenceGroup === newItem.referenceGroup
      );
      if (isReferenceGroupUsed) {
        form.setError('referenceGroup', {
          type: 'manual',
          message: formLabels?.validation?.referenceGroupAlreadyInUse,
        });
      } else {
        onChange([...(value || []), newItem]);
      }
    }
  };

  const handleOnRemove = (val) => {
    const updatedValue = [...value];
    updatedValue.splice(val, 1);
    onChange([...updatedValue]);
  };

  return (
    <>
      <ContextContainer direction="row" alignItems="start">
        <Controller
          name="referenceGroup"
          rules={{
            required: formLabels?.validation?.requiredField,
          }}
          control={form.control}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              label={formLabels?.referenceGroup}
              data={groupsSelectData}
              placeholder={formLabels?.referenceGroupPlaceholder}
              sx={{ width: 168 }}
              onBlur={() => form.clearErrors()}
              error={fieldState.error}
              required
              disabled={refGroupdisabled}
            />
          )}
        />
        <Controller
          name="classroomId"
          control={form.control}
          render={({ field }) => (
            <TextInput
              {...field}
              label={formLabels?.classroomId}
              placeholder={formLabels?.textPlaceholder}
              sx={{ width: 192 }}
            />
          )}
        />
        <InputWrapper showEmptyLabel>
          <Button variant="link" leftIcon={<AddCircleIcon />} onClick={handleOnAdd}>
            {formLabels?.labels?.add}
          </Button>
        </InputWrapper>
      </ContextContainer>

      {classroomsData?.length > 0 && (
        <Stack fullWidth>
          <TableInput
            columns={tableInputColumns}
            labels={{
              add: formLabels?.labels?.add,
              remove: formLabels?.labels?.remove,
              edit: formLabels?.labels?.edit,
              accept: formLabels?.labels?.accept,
              cancel: formLabels?.labels?.cancel,
            }}
            data={classroomsData.map((item) => ({
              ...item,
              editable: usedGroups?.length ? !item?.id : true, // We don't allow the removal of reference groups once a subject is initialized, currently the component only counts removal and edition as the same thing
            }))}
            removable={true}
            onRemove={handleOnRemove}
            editable={false}
            sortable={false}
            canAdd={false}
          />
        </Stack>
      )}
    </>
  );
};

ReferenceGroupsClassroomsSetup.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.array,
  groups: PropTypes.array,
  selectedCourses: PropTypes.array,
  formLabels: PropTypes.object,
  isMultiCourse: PropTypes.bool,
  refGroupdisabled: PropTypes.bool,
  usedGroups: PropTypes.array,
};

export default ReferenceGroupsClassroomsSetup;
