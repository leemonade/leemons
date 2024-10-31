import { PluginSettingsIcon } from '@bubbles-ui/icons/outline';
import PropTypes from 'prop-types';

import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';

export function ConfigAction({ onConfig, activity, id }) {
  const { useWatch } = useModuleAssignContext();
  const isDeleted = useWatch({ name: `state.deleted.${id}` });

  if (isDeleted) {
    return null;
  }

  return <PluginSettingsIcon onClick={() => onConfig({ activity, id })} width={18} height={18} />;
}

ConfigAction.propTypes = {
  onConfig: PropTypes.func,
  activity: PropTypes.object,
  id: PropTypes.string,
};
