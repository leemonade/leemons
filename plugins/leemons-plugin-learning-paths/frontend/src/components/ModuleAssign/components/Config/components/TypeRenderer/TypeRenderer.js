import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Switch } from '@bubbles-ui/components';
import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';

export function TypeRenderer({ id, localizations, defaultValue }) {
  const { useWatch, setValue } = useModuleAssignContext();
  const value = useWatch({ name: `state.type.${id}` });

  const onChange = useCallback((newValue) => setValue(`state.type.${id}`, newValue), [setValue]);

  useEffect(() => {
    if (!value) {
      onChange(defaultValue);
    }
  }, []);

  return (
    <Switch
      label={localizations.mandatory}
      value={value === 'blocking'}
      onChange={(checked) => {
        onChange(checked ? 'blocking' : 'optional');
      }}
    />
  );
}

TypeRenderer.propTypes = {
  id: PropTypes.string,
  localizations: PropTypes.object,
  position: PropTypes.number,
  defaultValue: PropTypes.string,
};

export default TypeRenderer;
