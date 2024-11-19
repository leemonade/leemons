import { ActionButton } from '@bubbles-ui/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/outline';
import { UndeleteIcon } from '@bubbles-ui/icons/solid';
import PropTypes from 'prop-types';

import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';

export function DeleteAction({ id }) {
  const { useWatch, setValue } = useModuleAssignContext();

  const onToggleDelete = (deleted) => setValue(`state.deleted.${id}`, deleted);
  const isDeleted = useWatch({ name: `state.deleted.${id}` });

  if (isDeleted) {
    return (
      <ActionButton
        icon={<UndeleteIcon width={18} height={18} />}
        onClick={() => onToggleDelete(false)}
      />
    );
  }

  return (
    <ActionButton
      icon={<DeleteBinIcon width={18} height={18} />}
      onClick={() => onToggleDelete(true)}
    />
  );
}

DeleteAction.propTypes = {
  id: PropTypes.string,
};
