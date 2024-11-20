import { forwardRef, useEffect, useState } from 'react';

import { MultiSelect, Select } from '@bubbles-ui/components';
import { noop, sortBy } from 'lodash';
import PropTypes from 'prop-types';

import useProgramsByCenter from '@academic-portfolio/hooks/queries/useCenterPrograms';

const SelectProgram = forwardRef(
  (
    {
      firstSelected,
      center,
      value: userValue,
      onChange,
      ensureIntegrity,
      teacherTypeFilter,
      multiple,
      autoSelectOneOption = true,
      onLoadedPrograms = noop,
      hideIfOnlyOne,
      disabled,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState(userValue);

    const { data, isLoading: loading } = useProgramsByCenter({
      center,
      teacherTypeFilter,
      options: {
        select: (programs) => {
          const sortedPrograms = sortBy(programs, 'createdAt');
          return sortedPrograms.map(({ id, name }) => ({ label: name, value: id }));
        },
      },
    });

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
      if (firstSelected && data?.length > 0 && !userValue) {
        handleChange(data[0].value);
      }
      onLoadedPrograms(data);
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

    if (hideIfOnlyOne && data?.length === 1) {
      return null;
    }

    if (multiple) {
      return (
        <MultiSelect
          {...props}
          ref={ref}
          data={data || []}
          disabled={!data?.length || disabled}
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
        disabled={!data?.length || disabled}
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
  onLoadedPrograms: PropTypes.func,
  ensureIntegrity: PropTypes.bool,
  firstSelected: PropTypes.bool,
  multiple: PropTypes.bool,
  autoSelectOneOption: PropTypes.bool,
  hideIfOnlyOne: PropTypes.bool,
  teacherTypeFilter: PropTypes.string,
  disabled: PropTypes.bool,
};

export { SelectProgram };
export default SelectProgram;
