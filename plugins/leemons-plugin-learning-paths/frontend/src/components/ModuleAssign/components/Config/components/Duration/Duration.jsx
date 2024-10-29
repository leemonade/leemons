import { TimeInput } from '@bubbles-ui/components';
import { TimeClockCircleIcon } from '@bubbles-ui/icons/outline';
import PropTypes from 'prop-types';

import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';

export function Duration({ id, timeState, setValue }) {
  const { useWatch } = useModuleAssignContext();
  const isDeleted = useWatch({ name: `state.deleted.${id}` });

  if (isDeleted) {
    return null;
  }

  return (
    <TimeInput
      sx={{ minWidth: 123 }}
      icon={<TimeClockCircleIcon />}
      clearable
      value={timeState?.[id]}
      onChange={(newValue) => setValue(`state.time.${id}`, newValue)}
    />
  );
}

Duration.propTypes = {
  id: PropTypes.string,
  timeState: PropTypes.object,
  setValue: PropTypes.func,
};
