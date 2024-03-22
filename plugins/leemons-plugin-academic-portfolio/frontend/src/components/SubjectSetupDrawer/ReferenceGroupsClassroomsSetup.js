import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Select,
  TableInput,
  ContextContainer,
  TextInput,
  NumberInput,
  InputWrapper,
  Button,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { cloneDeep } from 'lodash';

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
        style: { width: 196 },
      },
      {
        Header: 'Plazas disponibles 🌎',
        accessor: 'availableSeats',
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

  // Reset the classrooms to create when not multicourses subjects change the picked course
  useEffect(() => {
    if (!isMultiCourse) {
      const courseIds = selectedCourses.map((course) => course.id);
      const classroomsNotMatchingCourses = classroomsData.some(
        (classroom) => !courseIds.includes(classroom.course)
      );
      if (classroomsNotMatchingCourses) {
        onChange([]);
      }
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
            <TextInput {...field} label="Id de aula 🌎" placeholder="Id...🌎" sx={{ width: 168 }} />
          )}
        />
        <Controller
          name="availableSeats"
          control={form.control}
          rules={{
            required: 'This field is required 🌎',
            validate: (val) => val >= 1 || 'Value cannot be less than 1 🌎',
          }}
          render={({ field, fieldState }) => (
            <NumberInput
              {...field}
              label="Plazas disponible 🌎"
              min={1}
              placeholder="Número de plazas 🌎"
              sx={{ width: 168 }}
              onBlur={() => form.clearErrors()}
              error={fieldState.error?.message}
              required
            />
          )}
        />
        <InputWrapper showEmptyLabel>
          <Button variant="link" leftIcon={<AddCircleIcon />} onClick={handleOnAdd}>
            {labels?.add || 'ADD 🌎'}
          </Button>
        </InputWrapper>
      </ContextContainer>

      {classroomsData?.length > 0 && (
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
