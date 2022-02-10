import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Select } from '@bubbles-ui/components';
import { listCoursesRequest } from '../../request';

export default function SelectCourse({ program, value: userValue, onChange, ...props }) {
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

  // EN: Update the value when controlled value changes
  // ES: Actualizar el valor cuando el valor controlado cambia
  useEffect(() => {
    if (data.length && userValue) {
      setValue(userValue);
    }
  }, [userValue]);

  // EN: Get programs from API on center change
  // ES: Obtener programas desde API en cambio de centro
  useEffect(async () => {
    if (program) {
      const {
        data: { items },
      } = await listCoursesRequest({ page: 0, size: 9999, program });

      setData(
        items
          .sort((a, b) => a.index - b.index)
          .map(({ id, name, index }) => ({ value: id, label: name || index }))
      );
    }
  }, [program]);

  return (
    <Select {...props} data={data} disabled={!data.length} onChange={handleChange} value={value} />
  );
}

SelectCourse.propTypes = {
  program: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
