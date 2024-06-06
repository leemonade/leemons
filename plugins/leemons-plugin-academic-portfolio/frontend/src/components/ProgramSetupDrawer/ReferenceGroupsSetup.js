import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  TextInput,
  InputWrapper,
  ContextContainer,
  Stack,
  NumberInput,
  Text,
  Select,
  Title,
} from '@bubbles-ui/components';
import { isEmpty } from 'lodash';

/*
 referenceGroups: {
  nameFormat: string,
  digits: null|number,
  prefix: null|string,
  customNameFormat: null|string
  groupsForCourse${courseIndex} // the amount of groups to be created for that specific course
}
  When building the body of the request, if all groups use the same Reference groups (not sequential courses case)
  a new property is used groupsForlAllCourses and the groupsForCourse1 is eliminated.
*/
const ReferenceGroupsSetup = ({
  onChange,
  value,
  localizations,
  programCourses,
  coursesAreSequential,
}) => {
  const formLabels = useMemo(() => {
    if (!localizations) return {};
    return localizations?.programDrawer?.addProgramForm?.referenceGroupsSetup;
  }, [localizations]);

  const nameFormatData = useMemo(
    () => [
      {
        label: formLabels?.nameFormatOptions?.alphabetical,
        value: 'alphabetical',
      },
      { label: formLabels?.nameFormatOptions?.numerical, value: 'numerical' },
      { label: formLabels?.nameFormatOptions?.custom, value: 'custom' },
    ],
    [formLabels]
  );
  const form = useForm();
  const { nameFormat, digits, prefix, customNameFormat } = form.watch();

  // FUNCTIONS & HANDLERS ·······································································································||

  const getNameExamples = (format, groupsAmount, prefixWhenCustom = '') => {
    if (format === 'alphabetical') {
      return `(${Array.from(
        { length: groupsAmount },
        (_, i) => `${prefixWhenCustom}${String.fromCharCode(65 + i)}`
      ).join(', ')})`;
    }
    if (format === 'numerical') {
      return `(${Array.from(
        { length: groupsAmount },
        (_, i) => `${prefixWhenCustom}${(i + 1).toString().padStart(digits || 0, '0')}`
      ).join(', ')})`;
    }
    if (format === 'custom') {
      return getNameExamples(customNameFormat, groupsAmount, prefix);
    }
    return null;
  };

  const handleOnChange = () => {
    const allValues = form.getValues();

    const needsDigits =
      allValues?.nameFormat === 'numerical' ||
      (allValues?.nameFormat === 'custom' && allValues.customNameFormat === 'numerical');

    if (needsDigits) {
      allValues.digits = allValues.digits || 1;
    } else {
      allValues.digits = null;
    }

    if (allValues.nameFormat !== 'custom') {
      allValues.customNameFormat = null;
      allValues.prefix = null;
    }

    onChange({ ...allValues });
  };

  const handleDefaultValues = (courses) => {
    const defaultValues = {
      nameFormat: 'alphabetical',
      prefix: null,
      digits: null,
      customNameFormat: null,
    };
    if (courses?.length) {
      courses?.forEach(({ index }) => {
        defaultValues[`groupsForCourse${index}`] = 1;
      });
    } else {
      defaultValues.groupsForCourse1 = 1; // only 1 course cases
    }
    onChange({ ...defaultValues });
  };

  // EFFECTS ···················································································································||

  useEffect(() => {
    if (value) {
      Object.entries(value).forEach(([key, val]) => {
        if (form.getValues(key) !== val) {
          form.setValue(key, val);
        }
      });
    } else if (programCourses?.length && coursesAreSequential) {
      handleDefaultValues([...programCourses]);
    } else if (!programCourses || !coursesAreSequential) {
      handleDefaultValues();
    }
  }, [value, programCourses, handleDefaultValues]);

  useEffect(() => {
    if (programCourses?.length && !isEmpty(value)) {
      const courseGroupsKeys = Object.keys(value).filter((key) =>
        key?.startsWith('groupsForCourse')
      );
      const programsDifference = programCourses.length - courseGroupsKeys.length;
      const updateObject = { ...value };
      // Adds groups to a new course set by the user when courses are sequential
      if (programsDifference > 0 && coursesAreSequential) {
        programCourses?.forEach(({ index }) => {
          const fieldName = `groupsForCourse${index}`;
          if (!value[fieldName]) {
            form.setValue(fieldName, 1);
            updateObject[`groupsForCourse${index}`] = 1; // Defaults to 1 group
          }
        });
        onChange(updateObject);
      } else if (programsDifference < 0) {
        courseGroupsKeys.forEach((key) => {
          if (!programCourses.some(({ index }) => `groupsForCourse${index}` === key)) {
            delete updateObject[key];
          }
        });
        onChange(updateObject);
      }
    }
  }, [programCourses, value]);

  useEffect(() => {
    form.setValue('digits', 1);
    form.setValue('customNameFormat', null);
  }, [nameFormat]);

  return (
    <ContextContainer>
      <Stack direction="column" spacing={4}>
        <Controller
          control={form.control}
          name="nameFormat"
          render={({ field }) => (
            <Select
              {...field}
              label={formLabels?.nameFormat}
              data={nameFormatData}
              sx={{ width: nameFormat === 'custom' ? 280 + 8 : 216 }}
              onChange={(val) => {
                form.setValue('nameFormat', val);
                handleOnChange();
              }}
            />
          )}
        />
        {nameFormat === 'custom' && (
          <InputWrapper label={formLabels?.prefix}>
            <Stack spacing={2}>
              <Controller
                control={form.control}
                name="prefix"
                render={({ field }) => (
                  <TextInput
                    {...field}
                    placeholder={formLabels?.prefixPlaceholder}
                    sx={{ width: 100 }}
                    onChange={(val) => {
                      form.setValue('prefix', val);
                      handleOnChange();
                    }}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="customNameFormat"
                render={({ field }) => (
                  <Select
                    {...field}
                    data={nameFormatData.filter((item) => item.value !== 'custom')}
                    placeholder={formLabels?.nameFormatPlaceholder}
                    sx={{ width: 180 }}
                    onChange={(val) => {
                      form.setValue('customNameFormat', val);
                      handleOnChange();
                    }}
                  />
                )}
              />
            </Stack>
          </InputWrapper>
        )}
        {(nameFormat === 'numerical' || customNameFormat === 'numerical') && (
          <Controller
            control={form.control}
            name="digits"
            render={({ field }) => (
              <NumberInput
                {...field}
                label={formLabels?.digits}
                defaultValue={1}
                min={1}
                customDesign
                sx={{ width: 120 }}
                onChange={(val) => {
                  form.setValue('digits', val);
                  handleOnChange();
                }}
              />
            )}
          />
        )}
      </Stack>
      <ContextContainer>
        <Title sx={(theme) => theme.other.score.content.typo.lg}>{formLabels?.offeredGroups}</Title>
        {coursesAreSequential &&
          programCourses?.length > 0 &&
          programCourses?.map(({ index }) => (
            <Stack key={`groupsForCourse${index}`} alignItems="center" spacing={4}>
              <Text sx={{ width: 86 }}>{`${formLabels?.course} ${index}`}</Text>
              <Controller
                control={form.control}
                name={`groupsForCourse${index}`}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    defaultValue={1}
                    min={1}
                    customDesign
                    sx={{ width: 120 }}
                    onChange={(val) => {
                      form.setValue(`groupsForCourse${index}`, val);
                      handleOnChange();
                    }}
                  />
                )}
              />
              <Text>{getNameExamples(nameFormat, form.getValues(`groupsForCourse${index}`))}</Text>
            </Stack>
          ))}
        {(!programCourses || !coursesAreSequential) && (
          <Stack alignItems="center" spacing={4}>
            <Controller
              control={form.control}
              name={'groupsForCourse1'}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  defaultValue={1}
                  min={1}
                  customDesign
                  sx={{ width: 120 }}
                  onChange={(val) => {
                    form.setValue('groupsForCourse1', val);
                    handleOnChange();
                  }}
                />
              )}
            />
            <Text>{getNameExamples(nameFormat, form.getValues('groupsForCourse1'))}</Text>
          </Stack>
        )}
      </ContextContainer>
    </ContextContainer>
  );
};

ReferenceGroupsSetup.propTypes = {
  onChange: PropTypes.func,
  localizations: PropTypes.object,
  value: PropTypes.arrayOf(PropTypes.object),
  programCourses: PropTypes.array.isRequired,
  coursesAreSequential: PropTypes.bool,
};

export default ReferenceGroupsSetup;
