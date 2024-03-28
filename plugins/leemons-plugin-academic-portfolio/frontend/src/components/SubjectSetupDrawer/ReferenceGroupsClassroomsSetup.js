import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
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

const ReferenceGroupsClassroomsSetup = ({
  onChange,
  value,
  labels,
  groups,
  selectedCourses,
  isMultiCourse,
  refGroupdisabled,
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
        Header: 'Grupo de Referencia 🌎',
        accessor: 'referenceGroup',
        style: { width: 196 },
        valueRender: (val) => val?.split('::')[0],
      },
      {
        Header: 'Id de aula 🌎',
        accessor: 'classroomId',
        style: { width: 240 },
      },
    ],
    []
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
        .filter((group) => selectedCourses.some((course) => course.index === group.metadata.course))
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
          message: 'This reference group is already being used. Please select another one.',
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
            required: 'This field is required 🌎',
          }}
          control={form.control}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              label="Grupo de Referencia 🌎"
              data={groupsSelectData}
              placeholder="Selecciona uno... 🌎"
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
            <TextInput {...field} label="Id de aula 🌎" placeholder="Id...🌎" sx={{ width: 192 }} />
          )}
        />
        <InputWrapper showEmptyLabel>
          <Button variant="link" leftIcon={<AddCircleIcon />} onClick={handleOnAdd}>
            {labels?.add || 'ADD 🌎'}
          </Button>
        </InputWrapper>
      </ContextContainer>

      {classroomsData?.length > 0 && (
        <Stack fullWidth>
          <TableInput
            columns={tableInputColumns}
            labels={{
              add: labels?.add,
              remove: labels?.remove,
              edit: labels?.edit,
              accept: labels?.accept,
              cancel: labels?.cancel,
            }}
            data={classroomsData}
            removable
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
  labels: PropTypes.object,
  isMultiCourse: PropTypes.bool,
  refGroupdisabled: PropTypes.bool,
};

export default ReferenceGroupsClassroomsSetup;
