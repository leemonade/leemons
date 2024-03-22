import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  TextInput,
  Button,
  ContextContainer,
  Box,
  TableInput,
  MultiSelect,
  InputWrapper,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';

// HELPERS
const areCoursesAdjacent = (selectedCourses) => {
  const sortedCourses = [...selectedCourses].sort((a, b) => a - b);
  for (let i = 0; i < sortedCourses.length - 1; i++) {
    if (sortedCourses[i + 1] - sortedCourses[i] !== 1) {
      return false;
    }
  }
  return true;
};

// * Cycles shape: { courses, name }
// En el backend cycles espera un array de ciclos con un valor courses: un array de strings indicando el indíce del curs

const CyclesSetup = ({ onChange, value, programCourses = [], labels = {} }) => {
  const [cyclesData, setCyclesData] = useState([]);
  const coursesData = useMemo(
    () =>
      programCourses?.map((item) => ({
        label: `${item.index}º`,
        value: item.index,
      })),
    [programCourses]
  );

  const form = useForm({
    mode: 'onChange',
    resolver: async (data) => {
      const errors = {};
      const values = {};

      if (!Array.isArray(data.cycleCourses) || !data.cycleCourses.length) {
        errors.cycleCourses = {
          type: 'required',
          message: 'Courses are required 🌎',
        };
      } else if (!areCoursesAdjacent(data.cycleCourses)) {
        errors.cycleCourses = {
          type: 'adjacency',
          message: 'Courses must be adjacent 🌎',
        };
      } else {
        values.cycleCourses = data.cycleCourses;
      }

      if (!data.cycleName) {
        errors.cycleName = {
          type: 'required',
          message: 'Cycle name is required 🌎',
        };
      } else {
        values.cycleName = data.cycleName;
      }

      return {
        values: Object.keys(errors).length === 0 ? values : {}, // Return only if there are no errors
        errors,
      };
    },
  });

  // EFFECTS ················································································································ ||

  useEffect(() => {
    if (value?.length > 0) {
      setCyclesData([
        ...value.map(({ name, courses }, i) => ({
          name,
          courses,
          index: i + 1,
        })),
      ]);
    } else {
      setCyclesData([]);
    }
  }, [value]);

  useEffect(() => {
    const updatedCyclesData = cyclesData
      .map((cycle) => {
        const updatedCourses = cycle?.courses?.filter((courseIndex) =>
          programCourses.some((programCourse) => programCourse.index === courseIndex)
        );
        return { ...cycle, courses: updatedCourses };
      })
      .filter((cycle) => cycle.courses.length > 0);

    onChange(updatedCyclesData);
  }, [programCourses]);

  // HANDLERS ················································································································ ||

  const onAdd = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const name = form.getValues('cycleName');
      let courses = form.getValues('cycleCourses');
      courses = courses.sort((a, b) => a - b);

      const cleanOldCycles = cyclesData.map(({ name: _name, courses: _courses }) => ({
        name: _name,
        courses: _courses,
      }));
      onChange([...cleanOldCycles, { name, courses }]);
    }
  };

  const tableInputColumns = [
    {
      accessor: 'index',
    },
    {
      accessor: 'name',
    },
    {
      accessor: 'courses',
      valueRender: (coursesValue) => coursesValue?.map((index) => `${index}º`).join(', '),
    },
  ];

  return (
    <ContextContainer spacing={1}>
      <ContextContainer direction="row" alignItems="start">
        <Box sx={{ width: 216, minHeight: 88 }}>
          <Controller
            control={form.control}
            name="cycleName"
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                required
                label={'Nombre del ciclo 🌎'}
                error={
                  fieldState.error ? fieldState.error.message : form.formState.errors.cycleName
                }
                placeholder={'Añadir texto... 🌎'}
              />
            )}
          />
        </Box>
        <Box sx={{ width: 216, minHeight: 88 }}>
          <Controller
            control={form.control}
            name="cycleCourses"
            render={({ field, fieldState }) => (
              <MultiSelect
                {...field}
                required
                label={'Cursos 🌎'}
                placeholder={'Seleccionar cursos... 🌎'}
                data={coursesData}
                error={
                  fieldState.error ? fieldState.error.message : form.formState.errors.cycleCourses
                }
              />
            )}
          />
        </Box>
        <InputWrapper showEmptyLabel>
          <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onAdd}>
            {'Añadir 🌎'}
          </Button>
        </InputWrapper>
      </ContextContainer>

      {value?.length > 0 && (
        <Box>
          <TableInput
            columns={tableInputColumns}
            labels={{
              add: labels?.add,
              remove: labels?.remove,
              edit: labels?.edit,
              accept: labels?.accept,
              cancel: labels?.cancel,
            }}
            canAdd={false}
            removable
            data={cyclesData}
            showHeaders={false}
            onChange={(data) => {
              const updateObject = data.map(({ name, courses }) => ({ name, courses }));
              onChange(updateObject);
            }}
          />
        </Box>
      )}
    </ContextContainer>
  );
};

CyclesSetup.propTypes = {
  onChange: PropTypes.func,
  labels: PropTypes.object,
  value: PropTypes.arrayOf(PropTypes.object),
  programCourses: PropTypes.array.isRequired,
};

export default CyclesSetup;
