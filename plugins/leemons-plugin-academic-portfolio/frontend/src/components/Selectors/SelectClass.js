import React, { forwardRef, useCallback, useEffect, useState } from 'react';

import { Select } from '@bubbles-ui/components';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

import { listClassesRequest, listSessionClassesRequest } from '../../request';

const classesNeedFallbackIdentifier = (classesData) => {
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
      course,
      onlyClassesWhichIBelong,
      value: userValue,
      allowNullValue,
      customOptions = [],
      onChange,
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
        if (onlyClassesWhichIBelong) {
          const { classes } = await listSessionClassesRequest({
            program,
          });
          _classes = classes;
        } else {
          const {
            data: { items },
          } = await listClassesRequest({ page: 0, size: 9999, program });
          _classes = items;
        }

        if (course) {
          _classes = _classes.filter(({ courses }) => {
            return courses.id === course;
          });
        }

        setData(
          _classes
            .map(({ id, courses, subject, ...classData }) => {
              const group = classData.groups?.abbreviation;

              const classIdentifier =
                group || classData.alias || classData.classroomId
                  ? ` - ${group || classData.alias || classData.classroomId}`
                  : '';

              const fallbackClassIdentifier = classesNeedFallbackIdentifier(_classes)
                ? ` - ${classData.classWithoutGroupId}`
                : '';

              const suffix = course
                ? `${classIdentifier || fallbackClassIdentifier}`
                : ` - ${courses?.name || courses?.index}`;

              return {
                value: id,
                label: `${subject?.name}${suffix}`,
              };
            })
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      }
    }, [program, course, onlyClassesWhichIBelong]);

    // EN: Update the value when controlled value changes
    // ES: Actualizar el valor cuando el valor controlado cambia
    useEffect(() => {
      if (data.length && userValue) {
        setValue(userValue);
      } else if (allowNullValue && !userValue) {
        setValue(null);
      }
    }, [userValue, data]);

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
    }, [program, course, debouncedLoadClasses]);

    return (
      <Select
        {...props}
        ref={ref}
        data={[...customOptions, ...data]}
        disabled={!data.length}
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
};

export { SelectClass };
export default SelectClass;
