import React, { forwardRef, useEffect, useState } from 'react';

import { Select } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { listClassesRequest, listSessionClassesRequest } from '../../request';

const SelectClass = forwardRef(
  (
    {
      program,
      course,
      onlyClassesWhichIBelong,
      value: userValue,
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

    async function loadClasses() {
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
          _classes = _classes.filter(({ courses }) => courses.id === course);
        }

        setData(
          _classes.map(({ id, courses, subject }) => {
            const suffix = course ? '' : ` - ${courses?.name || courses?.index}`;
            return {
              value: id,
              label: `${subject?.name}${suffix}`,
            };
          })
        );
      }
    }

    // EN: Update the value when controlled value changes
    // ES: Actualizar el valor cuando el valor controlado cambia
    useEffect(() => {
      if (data.length && userValue) {
        setValue(userValue);
      }
    }, [userValue]);

    // EN: Get programs from API on center change
    // ES: Obtener programas desde API en cambio de centro
    useEffect(() => {
      loadClasses();
    }, [program, course]);

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
};

export { SelectClass };
export default SelectClass;
