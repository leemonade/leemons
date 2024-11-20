import { forwardRef, useCallback, useEffect, useState } from 'react';

import { Select } from '@bubbles-ui/components';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

import { listClassesRequest, listSessionClassesRequest } from '../../request';

const isThereMoreThanOneClassPerSubject = (classesData) => {
  let result = false;

  const subjectClassCount = new Map();

  classesData.forEach((classItem) => {
    const subjectId = classItem.subject?.id;
    if (subjectId) {
      subjectClassCount.set(subjectId, (subjectClassCount.get(subjectId) || 0) + 1);
    }
  });

  result = Array.from(subjectClassCount.values()).some((count) => count > 1);

  return result;
};

const SelectClass = forwardRef(
  (
    {
      program,
      course: courseFilter,
      onlyClassesWhichIBelong,
      teacherTypeFilter,
      value: userValue,
      allowNullValue,
      customOptions = [],
      onChange,
      mergeSubjectNameWithClass = true,
      subjectFilter,
      firstSelected,
      disabled,
      ...props
    },
    ref
  ) => {
    const [data, setData] = useState([]);
    const [value, setValue] = useState(userValue);

    const handleChange = (newValue) => {
      if (newValue !== value) {
        // EN: Do not update value if it is a controlled input
        // ES: No actualizar el valor si es un input controlado
        if (userValue === undefined) {
          setValue(newValue);
        }

        // EN: Notify the parent component about the change
        // ES: Notificar al componente padre sobre el cambio
        if (typeof onChange === 'function') {
          onChange(newValue);
        }
      }
    };

    const loadClasses = useCallback(async () => {
      if (program) {
        let _classes = [];
        if (onlyClassesWhichIBelong || teacherTypeFilter) {
          const { classes } = await listSessionClassesRequest({
            program,
            type: teacherTypeFilter,
          });
          _classes = classes;
        } else {
          const {
            data: { items },
          } = await listClassesRequest({ page: 0, size: 9999, program });
          _classes = items;
        }

        if (courseFilter) {
          _classes = _classes.filter(({ courses }) => {
            return courses.id === courseFilter;
          });
        }

        if (subjectFilter) {
          _classes = _classes.filter(({ subject }) => {
            return subject.id === subjectFilter;
          });
        }

        setData(
          _classes
            .map(({ id, courses, subject, groups, ...classData }) => {
              const classIdentifier =
                groups?.abbreviation ||
                classData.alias ||
                classData.classroomId ||
                classData.classWithoutGroupId;

              let mergedName = '';
              if (mergeSubjectNameWithClass) {
                let suffix = '';
                const separator = ' - ';
                const classIdentifierForMergedName = isThereMoreThanOneClassPerSubject(_classes)
                  ? classIdentifier
                  : '';

                // We only add the course for classes that belong to programs with sequential courses: with max one course per class.
                // It arrives as an object -or as an array one more than one course- and when not filtering by course
                if (!courseFilter && courses?.index) {
                  suffix += `${separator}${courses?.index}º`;
                }

                if (classIdentifierForMergedName) {
                  suffix += `${separator}${classIdentifierForMergedName}`;
                }

                mergedName = `${subject?.name}${suffix}`;
              }

              return {
                value: id,
                label: mergedName || classIdentifier,
              };
            })
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      }
    }, [
      program,
      courseFilter,
      onlyClassesWhichIBelong,
      subjectFilter,
      mergeSubjectNameWithClass,
      teacherTypeFilter,
    ]);

    // EN: Update the value when controlled value changes
    // ES: Actualizar el valor cuando el valor controlado cambia
    useEffect(() => {
      if (data.length && userValue) {
        setValue(userValue);
      } else if (allowNullValue && !userValue) {
        setValue(null);
      }
    }, [userValue, data]);

    useEffect(() => {
      if (firstSelected && data?.length > 0 && !userValue) {
        handleChange(data[0].value);
      }
    }, [data, firstSelected, userValue, data]);

    const debouncedLoadClasses = useCallback(() => {
      const debouncedFunc = debounce(() => {
        loadClasses();
      }, 300);

      debouncedFunc();

      return () => debouncedFunc.cancel();
    }, [loadClasses]);

    // EN: Get programs from API on center change
    // ES: Obtener programas desde API en cambio de centro
    useEffect(() => {
      return debouncedLoadClasses();
    }, [
      program,
      courseFilter,
      debouncedLoadClasses,
      subjectFilter,
      mergeSubjectNameWithClass,
      teacherTypeFilter,
    ]);

    return (
      <Select
        {...props}
        ref={ref}
        data={[...customOptions, ...data]}
        disabled={!data.length || disabled}
        onChange={handleChange}
        value={value}
      />
    );
  }
);

SelectClass.displayName = '@academic-portfolio/components/SelectClass';
SelectClass.propTypes = {
  customOptions: PropTypes.any,
  onlyClassesWhichIBelong: PropTypes.bool,
  program: PropTypes.string,
  course: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  allowNullValue: PropTypes.bool,
  teacherTypeFilter: PropTypes.string,
  mergeSubjectNameWithClass: PropTypes.bool,
  subjectFilter: PropTypes.string,
  firstSelected: PropTypes.bool,
  disabled: PropTypes.bool,
};

export { SelectClass };
export default SelectClass;
