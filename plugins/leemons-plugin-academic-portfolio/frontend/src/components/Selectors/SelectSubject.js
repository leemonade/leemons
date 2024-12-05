import { useState, useEffect, forwardRef } from 'react';

import { Select } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { listSubjectsRequest } from '../../request';

const SelectSubject = forwardRef(
  (
    {
      program,
      course,
      value: userValue,
      onChange,
      teacherTypeFilter,
      firstSelected,
      allowNullValue,
      disabled,
      onData,
      ...props
    },
    ref
  ) => {
    const [data, setData] = useState([]);
    const [value, setValue] = useState(userValue);

    useEffect(() => {
      if (typeof onData === 'function') {
        onData(data);
      }
    }, [data]);

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

    async function getSubjects() {
      if (program) {
        const {
          data: { items },
        } = await listSubjectsRequest({
          page: 0,
          size: 9999,
          program,
          course: [course],
          teacherTypeFilter,
        });

        setData(
          items.map(({ id, name }) => ({
            value: id,
            label: name,
          }))
        );
      }
    }

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

    // EN: Get programs from API on center change
    // ES: Obtener programas desde API en cambio de centro
    useEffect(() => {
      getSubjects();
    }, [program, course]);

    return (
      <Select
        {...props}
        ref={ref}
        data={data}
        disabled={!data.length || disabled}
        onChange={handleChange}
        value={value}
      />
    );
  }
);

SelectSubject.displayName = '@academic-portfolio/components/SelectSubject';
SelectSubject.propTypes = {
  program: PropTypes.string,
  course: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  teacherTypeFilter: PropTypes.string,
  firstSelected: PropTypes.bool,
  allowNullValue: PropTypes.bool,
  disabled: PropTypes.bool,
  onData: PropTypes.func,
};

export { SelectSubject };
export default SelectSubject;
