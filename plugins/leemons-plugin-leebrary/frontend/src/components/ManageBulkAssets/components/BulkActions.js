import { Stack, Button } from '@bubbles-ui/components';
import propTypes from 'prop-types';

const BulkActions = ({ onEdit, onShare, disabled }) => {
  return (
    <Stack justifyContent="flex-end" spacing={4}>
      <Button variant="outline" onClick={onEdit} disabled={disabled}>
        Editar en bloque
      </Button>
      <Button variant="outline" onClick={onShare} disabled={disabled}>
        Compartir en bloque
      </Button>
    </Stack>
  );
};

BulkActions.propTypes = {
  onEdit: propTypes.func,
  onShare: propTypes.func,
};

export { BulkActions };
