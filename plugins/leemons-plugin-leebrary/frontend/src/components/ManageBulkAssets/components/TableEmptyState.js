import { Stack, Text } from '@bubbles-ui/components';
import propTypes from 'prop-types';

const TableEmptyState = ({ query, t }) => {
  return (
    <Stack fullWidth justifyContent="center" alignItems="center">
      <Text>
        {t('tableEmptyState.query')} <Text strong>{query}</Text>
      </Text>
    </Stack>
  );
};

TableEmptyState.propTypes = {
  query: propTypes.string,
  t: propTypes.func,
};

export { TableEmptyState };
