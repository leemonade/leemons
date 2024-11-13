import { Stack, Button } from '@bubbles-ui/components';
import propTypes from 'prop-types';

const BulkActions = ({ onEdit, onShare, disabled, t }) => {
  return (
    <Stack justifyContent="flex-end" spacing={4}>
      <Button variant="outline" onClick={onEdit} disabled={disabled}>
        {t('bulkActionEditLabel')}
      </Button>
      <Button variant="outline" onClick={onShare} disabled={disabled}>
        {t('bulkActionShareLabel')}
      </Button>
    </Stack>
  );
};

BulkActions.propTypes = {
  onEdit: propTypes.func,
  onShare: propTypes.func,
  disabled: propTypes.bool,
  t: propTypes.func,
};

export { BulkActions };
