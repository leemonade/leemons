import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Select } from '@bubbles-ui/components';
import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';

export function useTypes({ localizations }) {
  return useMemo(
    () => [
      {
        value: 'optional',
        label: localizations?.optional,
      },
      {
        value: 'recommended',
        label: localizations?.recommended,
      },
      {
        value: 'mandatory',
        label: localizations?.mandatory,
      },
      {
        value: 'blocking',
        label: localizations?.blocking,
      },
    ],
    [localizations]
  );
}

export function TypeRenderer({ id, localizations, defaultValue }) {
  const types = useTypes({ localizations });
  const { useWatch, setValue } = useModuleAssignContext();
  const value = useWatch({ name: `state.type.${id}` });

  const onChange = useCallback((newValue) => setValue(`state.type.${id}`, newValue), [setValue]);

  useEffect(() => {
    if (!value) {
      onChange(defaultValue);
    }
  }, []);

  return <Select data={types} value={value} onChange={onChange} />;
}

TypeRenderer.propTypes = {
  id: PropTypes.string,
  localizations: PropTypes.object,
  position: PropTypes.number,
  defaultValue: PropTypes.string,
};
