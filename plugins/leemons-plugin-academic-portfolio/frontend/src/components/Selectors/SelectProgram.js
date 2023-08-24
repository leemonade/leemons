import { MultiSelect, Select } from '@bubbles-ui/components';
import { useApi } from '@common';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useState } from 'react';
import { listProgramsRequest } from '../../request';

// EN: Parse data fetched from the server
// ES: Procesar datos obtenidos del servidor
async function getData(center) {
  const centers = _.isArray(center) ? center : [center];
  const responses = await Promise.all(
    centers.map((_center) =>
      listProgramsRequest({
        page: 0,
        size: 9999,
        center: _center,
      })
    )
  );

  const items = [];
  responses.forEach((response) => {
    items.push(...response.data.items);
  });

  return items.map(({ id, name }) => ({ label: name, value: id }));
}

const SelectProgram = forwardRef(
  (
    {
      firstSelected,
      center,
      value: userValue,
      onChange,
      ensureIntegrity,
      multiple,
      autoSelectOneOption = true,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState(userValue);

    // EN: Get programs from API on center change
    // ES: Obtener programas desde API en cambio de centro
    const [data, , loading] = useApi(getData, center);

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
      setValue(userValue);
    }, [userValue]);

    useEffect(() => {
      if (firstSelected && data?.length > 0) {
        handleChange(data[0].value);
      }
    }, [data]);

    // EN: Ensure that the value is valid (exists in the data)
    // ES: Asegurar que el valor es válido (existe en los datos)
    useEffect(() => {
      if (ensureIntegrity && !loading) {
        const { length } = data;

        for (let i = 0; i < length; i++) {
          if (data[i].value === value) {
            return;
          }
        }
        handleChange(null);
      }
    }, [data, loading, value]);

    if (multiple) {
      return (
        <MultiSelect
          {...props}
          ref={ref}
          data={data || []}
          disabled={!data?.length}
          onChange={handleChange}
          value={value}
          autoSelectOneOption={autoSelectOneOption}
        />
      );
    }

    return (
      <Select
        {...props}
        ref={ref}
        data={data}
        disabled={!data?.length}
        onChange={handleChange}
        value={value}
        autoSelectOneOption={autoSelectOneOption}
      />
    );
  }
);

SelectProgram.displayName = '@academic-portfolio/components/SelectProgram';
SelectProgram.propTypes = {
  center: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  ensureIntegrity: PropTypes.bool,
  firstSelected: PropTypes.bool,
  multiple: PropTypes.bool,
  autoSelectOneOption: PropTypes.bool,
};

export { SelectProgram };
export default SelectProgram;
