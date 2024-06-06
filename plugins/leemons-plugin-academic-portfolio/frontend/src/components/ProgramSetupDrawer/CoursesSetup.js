import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ContextContainer,
  NumberInput,
  TableInput,
  useDebouncedValue,
} from '@bubbles-ui/components';
import { Controller, useForm } from 'react-hook-form';

// * Nuevo formato de coursos para el backend, un array de cursos
// maxCourses === courses.length
// Anteriormente todos los cursos se seteaban con la misma cantidad de creditos coursesCredits y no se especificaban seats
// Ahora usaremos este array para que cada curso tenga sus propios seats, min y max credits,

const blankCourse = { minCredits: null, maxCredits: null };

const CoursesSetup = ({
  onChange,
  localizations = {},
  value,
  showCredits = false,
  maxNumberOfCredits = 0,
}) => {
  const [coursesData, setCoursesData] = useState([]);
  const [maxCreditsDebounced] = useDebouncedValue(maxNumberOfCredits, 300);
  const form = useForm();

  const formLabels = useMemo(() => {
    if (!localizations) return {};
    return localizations?.programDrawer?.addProgramForm?.coursesSetup;
  }, [localizations]);

  useEffect(() => {
    if (value?.length > 0) {
      const orderedCourses = [...value].sort((a, b) => a.index - b.index);
      setCoursesData(orderedCourses);
      if (form.getValues('coursesAmount') !== orderedCourses?.length) {
        form.setValue('coursesAmount', orderedCourses.length);
      }
    } else {
      const defaultValues = Array.from({ length: 2 }, (_, i) => ({ index: i + 1, ...blankCourse }));
      onChange(defaultValues);
    }
  }, [value, onChange]);

  const handleCoursesAmountChange = (coursesAmount) => {
    const currentLength = coursesData.length;
    const amountDifference = coursesAmount - currentLength;

    if (amountDifference > 0) {
      const newCourses = [...coursesData];
      for (let i = 0; i < amountDifference; i++) {
        newCourses.push({ ...blankCourse, index: currentLength + i + 1 });
      }
      onChange(newCourses);
    } else if (amountDifference < 0) {
      onChange(coursesData.slice(0, coursesAmount));
    }
  };

  useEffect(() => {
    const updatedCourses = coursesData.map((course) => {
      if (course.maxCredits > maxCreditsDebounced) {
        return { ...course, maxCredits: maxCreditsDebounced };
      }
      return course;
    });
    if (JSON.stringify(updatedCourses) !== JSON.stringify(coursesData)) {
      onChange(updatedCourses);
    }
  }, [maxCreditsDebounced]);

  const tableInputColumns = useMemo(
    () => [
      {
        Header: formLabels?.course,
        accessor: 'index',
        style: { width: 140, paddingLeft: 10 },
        editable: false,
        valueRender: (indexValue) => `${formLabels?.course} ${indexValue}`,
      },
      {
        Header: formLabels?.minCredits,
        accessor: 'minCredits',
        input: {
          node: <NumberInput />,
        },
        valueRender: (minCreditsValue) => (!showCredits ? '--' : minCreditsValue),
        style: { width: 270, paddingLeft: 10, display: !showCredits && 'hidden' },
      },
      {
        Header: formLabels?.maxCredits,
        accessor: 'maxCredits',
        input: {
          node: <NumberInput />,
          rules: { validate: (fieldValue) => fieldValue <= maxNumberOfCredits },
        },
        style: { width: 270, paddingLeft: 10, display: !showCredits && 'hidden' },
        valueRender: (maxCreditsValue) => (!showCredits ? '--' : maxCreditsValue),
      },
    ],
    [localizations, maxNumberOfCredits, showCredits]
  );

  return (
    <ContextContainer>
      <Controller
        control={form.control}
        name="coursesAmount"
        render={({ field }) => (
          <NumberInput
            {...field}
            sx={{ width: 120 }}
            onChange={(fieldValue) => {
              if (fieldValue >= 2) {
                form.clearErrors('coursesAmount');
                handleCoursesAmountChange(fieldValue);
              } else {
                form.setError('coursesAmount', {
                  type: 'manual',
                  message: formLabels?.mustHaveAtLeastTwoCourses,
                });
              }
            }}
            min={2}
            defaultValue={2}
            customDesign
            error={form.formState.errors.coursesAmount}
          />
        )}
      />
      {showCredits && (
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
          removable={false}
          sortable={false}
          editable={showCredits}
          unique
          data={coursesData}
          onChange={(data) => {
            onChange(data);
          }}
        />
      )}
    </ContextContainer>
  );
};

CoursesSetup.propTypes = {
  onChange: PropTypes.func,
  localizations: PropTypes.object,
  value: PropTypes.arrayOf(PropTypes.object),
  showCredits: PropTypes.bool,
  maxNumberOfCredits: PropTypes.number,
};

export default CoursesSetup;
