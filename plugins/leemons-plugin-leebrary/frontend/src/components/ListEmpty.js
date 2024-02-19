import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, ImageLoader, Box } from '@bubbles-ui/components';
import { useLayout } from '@layout/context';

const ListEmpty = ({ t, isRecentPage }) => {
  const { theme } = useLayout();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      direction="column"
      spacing={5}
      fullWidth
      fullHeight
    >
      <Stack direction="column" style={{ maxWidth: 350, textAlign: 'center' }}>
        <Text size="md" color="soft">
          {isRecentPage ? t('labels.recentListEmpty') : t('labels.listEmpty')}
        </Text>
        {isRecentPage && (
          <Text size="md" color="soft">
            {t('labels.recentListEmptyDescription')}
          </Text>
        )}
      </Stack>
      {theme.usePicturesEmptyStates && (
        <ImageLoader src="/public/leebrary/empty.png" height={200} />
      )}
    </Stack>
  );
};

ListEmpty.propTypes = {
  t: PropTypes.func.isRequired,
  isRecentPage: PropTypes.bool,
};

export { ListEmpty };
export default ListEmpty;
