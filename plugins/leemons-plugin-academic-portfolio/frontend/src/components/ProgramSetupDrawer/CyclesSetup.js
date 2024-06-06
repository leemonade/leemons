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

const CyclesSetup = ({ onChange, value, programCourses = [], localizations = {} }) => {
  const [cyclesData, setCyclesData] = useState([]);

  const formLabels = useMemo(() => {
    if (!localizations) return {};
    return localizations?.programDrawer?.addProgramForm?.cyclesSetup;
  }, [localizations]);

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
          message: formLabels?.coursesRequired,
        };
      } else if (!areCoursesAdjacent(data.cycleCourses)) {
        errors.cycleCourses = {
          type: 'adjacency',
          message: formLabels?.coursesMustBeAdjacent,
        };
      } else {
        values.cycleCourses = data.cycleCourses;
      }

      if (!data.cycleName) {
        errors.cycleName = {
          type: 'required',
          message: `${formLabels?.cycleName} es requerido`,
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
      form.reset();
      const sortedValue = [
        ...value
          .map(({ name, courses, index }) => ({
            name,
            courses,
            index,
          }))
          .sort((a, b) => a.index - b.index),
      ];
      setCyclesData(sortedValue);
    } else {
      setCyclesData([]);
    }
  }, [value]);

  useEffect(() => {
    if (cyclesData?.length) {
      const updatedCyclesData = cyclesData
        .map((cycle) => {
          const updatedCourses = cycle?.courses?.filter((courseIndex) =>
            programCourses.some((programCourse) => programCourse.index === courseIndex)
          );
          return { ...cycle, courses: updatedCourses };
        })
        .filter((cycle) => cycle.courses.length > 0);

      onChange(updatedCyclesData.map((item, i) => ({ ...item, index: i + 1 })));
    }
  }, [programCourses]);

  // HANDLERS ················································································································ ||

  const onAdd = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const name = form.getValues('cycleName');
      let courses = form.getValues('cycleCourses');
      const index = cyclesData.length + 1;
      courses = courses.sort((a, b) => a - b);

      onChange([...cyclesData, { name, courses, index }]);
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
                label={formLabels?.cycleName}
                error={
                  fieldState.error ? fieldState.error.message : form.formState.errors.cycleName
                }
                placeholder={formLabels?.addTextPlaceholder}
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
                label={formLabels?.cycleCourses}
                placeholder={formLabels?.selectCoursesPlacehodler}
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
            {formLabels?.add}
          </Button>
        </InputWrapper>
      </ContextContainer>

      {value?.length > 0 && (
        <Box>
          <TableInput
            columns={tableInputColumns}
            labels={{
              add: localizations?.labels?.add,
              remove: localizations?.labels?.remove,
              edit: localizations?.labels?.edit,
              accept: localizations?.labels?.accept,
              cancel: localizations?.labels?.cancel,
            }}
            canAdd={false}
            removable
            data={cyclesData}
            showHeaders={false}
            onChange={(data) => {
              const updateObject = [...data].map((item, i) => ({ ...item, index: i + 1 }));
              onChange(updateObject);
            }}
            // onRemove={onRemove}
            // onSort={onSort}
          />
        </Box>
      )}
    </ContextContainer>
  );
};

CyclesSetup.propTypes = {
  onChange: PropTypes.func,
  localizations: PropTypes.object,
  value: PropTypes.arrayOf(PropTypes.object),
  programCourses: PropTypes.array.isRequired,
};

export default CyclesSetup;
