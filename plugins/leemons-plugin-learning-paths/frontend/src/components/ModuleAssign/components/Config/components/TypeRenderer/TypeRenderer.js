import { useCallback, useEffect } from 'react';

import { Switch } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';

export function TypeRenderer({ id, localizations, defaultValue }) {
  const { useWatch, setValue } = useModuleAssignContext();
  const value = useWatch({ name: `state.type.${id}` });
  const isDeleted = useWatch({ name: `state.deleted.${id}` });

  const onChange = useCallback((newValue) => setValue(`state.type.${id}`, newValue), [setValue]);

  useEffect(() => {
    if (!value) {
      onChange(defaultValue);
    }
  }, []);

  if (isDeleted) {
    return null;
  }

  return (
    <Switch
      label={localizations?.mandatory}
      checked={value === 'blocking'}
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
