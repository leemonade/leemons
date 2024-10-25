import { DeleteBinIcon } from '@bubbles-ui/icons/outline';
import { UndeleteIcon } from '@bubbles-ui/icons/solid';
import PropTypes from 'prop-types';

import { useModuleAssignContext } from '@learning-paths/contexts/ModuleAssignContext';

export function DeleteAction({ id }) {
  const { useWatch, setValue } = useModuleAssignContext();

  const onToggleDelete = (deleted) => setValue(`state.deleted.${id}`, deleted);
  const isDeleted = useWatch({ name: `state.deleted.${id}` });
  console.log(isDeleted);

  if (isDeleted) {
    return <UndeleteIcon onClick={() => onToggleDelete(false)} width={18} height={18} />;
  }

  return <DeleteBinIcon onClick={() => onToggleDelete(true)} width={18} height={18} />;
}

DeleteAction.propTypes = {
  id: PropTypes.string,
};
