import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Select } from '@bubbles-ui/components';
import { useModuleSetupContext } from '@learning-paths/contexts/ModuleSetupContext';
import { cloneDeep, get, set } from 'lodash';

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
  const [sharedData, setSharedData] = useModuleSetupContext();

  const value = get(sharedData, `state.props.${id}.type`);
  const onChange = useCallback(
    (newValue) => setSharedData((data) => set(cloneDeep(data), `state.props.${id}.type`, newValue)),
    [setSharedData]
  );

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
