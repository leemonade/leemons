import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { ContextContainer, Text, Stack, Title, NumberInput, Switch } from '@bubbles-ui/components';
import { isEmpty } from 'lodash';

const SeatsPerCourseSetup = ({ courses, onChange, value, localizations, sequentialCourses }) => {
  const [differentSeatsPerCourse, setDifferentSeatsPerCourse] = useState(false);
  const form = useForm();

  const formLabels = useMemo(() => {
    if (!localizations) return {};
    return localizations?.programDrawer?.addProgramForm?.seatsPerCourseSetup;
  }, [localizations]);

  // HANDLERS AND FUNCTIONS ··············································································||
  const handleDefaultValues = (_courses, switchOn) => {
    if (!switchOn) {
      onChange({ all: 1 });
      return;
    }
    const defaults = {};
    _courses.forEach(({ index }) => {
      defaults[index] = 1;
    });
    onChange({ ...defaults, all: undefined });
  };

  const handleOnChange = useCallback(
    (courseIndex, seatsValue) => {
      if (differentSeatsPerCourse) {
        onChange({ ...value, [courseIndex]: seatsValue, all: undefined });
      } else {
        onChange({ [courseIndex]: seatsValue || 1 });
      }
    },
    [differentSeatsPerCourse, onChange, value]
  );

  // EFFECTS ··············································································||
  useEffect(() => {
    if (value) {
      Object.entries(value).forEach(([key, val]) => {
        if (form.getValues(key) !== val) {
          form.setValue(key, val);
        }
      });

      if (Object.keys(value).length > 1) {
        setDifferentSeatsPerCourse(true);
      }
    } else {
      onChange({ all: 1 });
    }
  }, [value, form]);

  // Handle course addition or removal
  useEffect(() => {
    if (courses?.length && !isEmpty(value) && differentSeatsPerCourse) {
      const coursesSeatsKeys = Object.keys(value).filter((key) => key !== 'all');
      const coursesSeatsDifference = courses.length - coursesSeatsKeys.length;
      const updateObject = { ...value };

      if (coursesSeatsDifference > 0) {
        courses?.forEach(({ index }) => {
          if (!value[index]) {
            updateObject[index] = 1; // Defaults to 1 seat
          }
        });
        onChange(updateObject);
      } else if (coursesSeatsDifference < 0) {
        coursesSeatsKeys.forEach((key) => {
          if (!courses.some(({ index }) => index === parseInt(key))) {
            form.setValue(key, undefined);
            delete updateObject[key];
          }
        });
        onChange(updateObject);
      }
    }
  }, [courses, value, differentSeatsPerCourse]);

  return (
    <ContextContainer spacing={4}>
      <Title sx={(theme) => theme.other.score.content.typo.lg}>{formLabels?.offeredSeats}</Title>
      {courses?.length > 1 && sequentialCourses && (
        <>
          <Switch
            checked={differentSeatsPerCourse}
            label={formLabels?.seatsVaryByCourse}
            onChange={(val) => {
              setDifferentSeatsPerCourse(val);
              handleDefaultValues(courses, val);
            }}
          />

          {differentSeatsPerCourse &&
            courses?.map((course) => (
              <Stack key={`course-${course.index}-seats`} alignItems="center" spacing={4}>
                <Text sx={{ width: 100 }}>{`${formLabels?.course} ${course.index}`}</Text>
                <Controller
                  name={`${course.index}`}
                  defaultValue={1}
                  rules={{ required: localizations?.programDrawer?.requiredField }}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <NumberInput
                      {...field}
                      error={fieldState.error?.message}
                      customDesign
                      min={1}
                      value={field.value || 1}
                      sx={{ width: 120 }}
                      onChange={(val) => {
                        field.onChange();
                        handleOnChange(course.index, val);
                      }}
                    />
                  )}
                />
              </Stack>
            ))}
        </>
      )}
      {!differentSeatsPerCourse && (
        <Stack alignItems="center" spacing={4}>
          <Text sx={{ width: 100 }}>{formLabels?.numberOfSeats}</Text>
          <Controller
            name="all"
            control={form.control}
            rules={{ required: localizations?.programDrawer?.requiredField }}
            render={({ field, fieldState }) => (
              <NumberInput
                {...field}
                error={fieldState.error?.message}
                customDesign
                min={1}
                value={field.value || 1}
                sx={{ width: 120 }}
                onChange={(val) => {
                  field.onChange();
                  handleOnChange('all', val);
                }}
              />
            )}
          />
        </Stack>
      )}
    </ContextContainer>
  );
};

SeatsPerCourseSetup.propTypes = {
  courses: PropTypes.array,
  onChange: PropTypes.func,
  localizations: PropTypes.object,
  value: PropTypes.object,
  sequentialCourses: PropTypes.bool,
};

export default SeatsPerCourseSetup;
